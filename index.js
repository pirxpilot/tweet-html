const ago = require('yields-ago');
const el = require('el-component');
const uslice = require('unicode-substring');
const twemoji = require('twemoji');

module.exports = tweet2html;

function formatDate(created_at) {
  // Date format: ddd MMM DD HH:mm:ss ZZ YYYY
  return ago(new Date(created_at));
}

function tparse(str) {
  return twemoji.parse(str, {
    base: 'https://twemoji.maxcdn.com/v/latest/',
    folder: 'svg',
    ext: '.svg'
  });
}

function adjustText(tweet) {
  const text = [];
  let index = 0;
  tweet.textAdjustment
    .sort((a, b) => a.indices[0] - b.indices[0])
    .forEach(adj => {
      text.push(tparse(uslice(tweet.text, index, adj.indices[0])));
      text.push(adj.text);
      index = adj.indices[1];
    });
  if (index > 0) {
    text.push(tparse(uslice(tweet.text, index)));
    tweet.text = text.join('');
  } else {
    tweet.text = tparse(tweet.text);
  }
  delete tweet.textAdjustment;
}

function createTextAdjustment({indices, text, href}) {
  const ta = {
    indices,
    text: ''
  };
  if (text && href) {
    ta.text = el('a', text, { href, target: '_blank', rel: 'noopener' });
  }
  return ta;
}

function parseEntityType(entities, parsed, type, convertFn) {
  if(!entities[type]) {
    return;
  }
  entities[type].forEach(el => {
    let opts;
    let ta;
    opts = convertFn(el);
    if (opts) {
      if (opts.photo) {
        parsed.photo = opts.photo;
      }
      if (opts.iframe) {
        parsed.iframe = opts.iframe;
      }
      if (opts.video) {
        parsed.video = opts.video;
      }
      ta = createTextAdjustment(opts);
      parsed.textAdjustment.push(ta);
    }
  });
}

const entityParsers = {
  media(media) {
    let data = {
      indices: media.indices,
      text: ''
    };
    switch (media.type) {
      case 'photo':
        data.photo = {
          url: media.expanded_url,
          src: media.media_url_https
        };
        break;
      case 'youtube':
      case 'vimeo':
      case 'vine':
        data.iframe = {
          src: media.media_url_https,
          service: `video ${media.type}`
        };
        break;
      case 'video':
      case 'animated_gif':
        data.video = {
          poster: media.media_url_https,
          source: {}
        };
        media.video_info.variants.forEach(
          ({content_type, url}) => data.video.source[content_type] = url
        );
        break;
      default:
        data = undefined;
    }
    return data;
  },
  hashtags({text, indices}) {
    return {
      href: `https://twitter.com/hashtag/${text}`,
      text: `#${text}`,
      indices
    };
  },
  user_mentions({id_str, name, indices}) {
    return {
      href: `https://twitter.com/intent/user?user_id=${id_str}`,
      text: `@${name}`,
      indices
    };
  },
  urls({expanded_url, display_url, indices}) {
    return {
      href: expanded_url,
      text: display_url,
      indices
    };
  }
};

const urlPreParsers = [
  {
    type: 'photo',
    regex: /https?:\/\/(?:www\.)?instagram.com\/p\/([^\s\/]+)\/?/,
    toMediaUrl: match => `https://instagr.am/p/${match[1]}/media/?size=m`
  }, {
    type: 'youtube',
    regex: /https?:\/\/(?:youtu.be\/|(?:m|www).youtube.com\/watch\?v=)([^\s&]+)/,
    toMediaUrl: match =>
      `https://www.youtube.com/embed/${match[1]}?autohide=1&modestbranding=1&rel=0&theme=light`
  }, {
    type: 'vimeo',
    regex: /https?:\/\/vimeo.com\/(\S+)$/,
    toMediaUrl: match => `https://player.vimeo.com/video/${match[1]}`
 }, {
    type: 'vine',
    regex: /https?:\/\/vine.co\/v\/(\S+)$/,
    toMediaUrl: match => `https://vine.co/v/${match[1]}/embed/simple`
  }
];

function preParseUrl(entities, preParser) {
  if (entities.media && entities.media.length) {
    return; // only one media per tweet
  }
  if (!entities.urls) {
    return;
  }
  entities.media = entities.media || [];
  entities.urls = entities.urls.filter(({expanded_url, indices}) => {
    const match = expanded_url.match(preParser.regex);
    if (match) {
      entities.media.push({
        type: preParser.type,
        expanded_url,
        indices,
        media_url_https: preParser.toMediaUrl(match)
      });
      return false;
    }
    return true;
  });
}

function handleExtendedEntities(tweet) {
  const { extended_entities, entities } = tweet;
  if (!extended_entities) {
    return;
  }
  if (!extended_entities.media) {
    return;
  }
  const id2emedia = {};
  // find all extended media that we can process
  extended_entities.media.forEach(emedia => {
    if (emedia.type === 'video' || emedia.type == 'animated_gif') {
      id2emedia[emedia.id_str] = emedia;
    }
  });
  // replace legacy media with extended version
  entities.media = entities.media.map(media => id2emedia[media.id_str] || media);
  delete tweet.extended_entities;
}

function handleExtendedCompatibilityEntities(tweet) {
  if (!tweet.extended_tweet) {
    return;
  }

  tweet.full_text = tweet.extended_tweet.full_text;
  tweet.entities = tweet.extended_tweet.entities;
}

// interesting things about the tweet
// item.created_at
// item.text - tweet text
// item.full_text - tweet text for an untruncated tweet
// item.entities - hashtags, urls, user_mentions, media (type: photo)
function parseTweet(tweet, username, opts) {
  handleExtendedCompatibilityEntities(tweet);
  const parsed = {
    href: `https://twitter.com/${username}/status/${tweet.id_str}`,
    text: tweet.full_text || tweet.text,
    date: opts.formatDate(tweet.created_at),
    textAdjustment: []
  };
  handleExtendedEntities(tweet);
  urlPreParsers.forEach(preParseUrl.bind(null, tweet.entities));
  Object.entries(entityParsers).forEach(
    ([ type, parser ]) => parseEntityType(tweet.entities, parsed, type, parser)
  );
  adjustText(parsed);
  return parsed;
}

function htmlTweet(tweet) {
  const content = [
    el('a.date', tweet.date, { href: tweet.href, target: '_blank', rel: 'noopener' }),
    el('.text', tweet.text)
  ];
  if (tweet.photo) {
    const img = el('img', { src: tweet.photo.src });
    content.push(el('a.photo', img, { href: tweet.photo.url,  target: '_blank', rel: 'noopener' }));
  }
  if (tweet.iframe) {
    content.push(el('iframe', { src: tweet.iframe.src, 'class': tweet.iframe.service }));
  }
  if (tweet.video) {
    const sources = Object.entries(tweet.video.source)
      .map(([type, src]) => el('source', { src, type }))
      .join('');
    content.push(el('video', sources, {
      controls: '',
      poster: tweet.video.poster
    }));
  }

  return content.join('');
}

function tweet2html(tweet, username, opts = { formatDate }) {
  return htmlTweet(parseTweet(tweet, username, opts));
}
