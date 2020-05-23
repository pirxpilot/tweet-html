var ago = require('yields-ago');
var el = require('el-component');
var uslice = require('unicode-substring');
var twemoji = require('twemoji');

module.exports = tweet2html;

function formatDate(created_at) {
  // Date format: ddd MMM DD HH:mm:ss ZZ YYYY
  return ago(new Date(created_at));
}

function tparse(str) {
  return twemoji.parse(str, {
    folder: 'svg',
    ext: '.svg'
  });
}

function adjustText(tweet) {
  var text = [];
  var index = 0;
  tweet.textAdjustment
    .sort(function(a, b) {
      return a.indices[0] - b.indices[0];
    })
    .forEach(function(adj) {
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

function createTextAdjustment(opt) {
  var ta = {
    indices: opt.indices,
    text: ''
  };
  if (opt.text && opt.href) {
    ta.text = el('a', opt.text, { href: opt.href, target: '_blank', rel: 'noopener' });
  }
  return ta;
}

function parseEntityType(entities, parsed, type, convertFn) {
  if(!entities[type]) {
    return;
  }
  entities[type].forEach(function(el) {
    var opts, ta;
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

var entityParsers = {
  media: function(media) {
    var data = {
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
          service: 'video ' + media.type
        };
        break;
      case 'video':
      case 'animated_gif':
        data.video = {
          poster: media.media_url_https,
          source: {}
        };
        media.video_info.variants.forEach(function(variant) {
          data.video.source[variant.content_type] = variant.url;
        });
        break;
      default:
        data = undefined;
    }
    return data;
  },
  hashtags: function(tag) {
    return {
      href: 'https://twitter.com/hashtag/' + tag.text,
      text: '#' + tag.text,
      indices: tag.indices
    };
  },
  user_mentions: function(mention) {
    return {
      href: 'https://twitter.com/intent/user?user_id=' + mention.id_str,
      text: '@' + mention.name,
      indices: mention.indices
    };
  },
  urls: function(url) {
    return {
      href: url.expanded_url,
      text: url.display_url,
      indices: url.indices
    };
  }
};

var urlPreParsers = [
  {
    type: 'photo',
    regex: /https?:\/\/(?:www\.)?instagram.com\/p\/([^\s\/]+)\/?/,
    toMediaUrl: function(match) {
      return 'https://instagr.am/p/' + match[1] + '/media/?size=m';
    }
  }, {
    type: 'youtube',
    regex: /https?:\/\/(?:youtu.be\/|(?:m|www).youtube.com\/watch\?v=)([^\s&]+)/,
    toMediaUrl: function(match) {
      return 'https://www.youtube.com/embed/' + match[1] + '?autohide=1&modestbranding=1&rel=0&theme=light';
    }
  }, {
    type: 'vimeo',
    regex: /https?:\/\/vimeo.com\/(\S+)$/,
    toMediaUrl: function(match) {
      return 'https://player.vimeo.com/video/' + match[1];
    }
 }, {
    type: 'vine',
    regex: /https?:\/\/vine.co\/v\/(\S+)$/,
    toMediaUrl: function(match) {
      return 'https://vine.co/v/' + match[1] + '/embed/simple';
    }
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
  entities.urls = entities.urls.filter(function(url) {
    var match = url.expanded_url.match(preParser.regex);
    if (match) {
      entities.media.push({
        type: preParser.type,
        expanded_url: url.expanded_url,
        indices: url.indices,
        media_url_https: preParser.toMediaUrl(match)
      });
      return false;
    }
    return true;
  });
}

function handleExtendedEntities(tweet) {
  if (!tweet.extended_entities) {
    return;
  }
  if (!tweet.extended_entities.media) {
    return;
  }
  var id2emedia = {};
  // find all extended media that we can process
  tweet.extended_entities.media.forEach(function(emedia) {
    if (emedia.type === 'video' || emedia.type == 'animated_gif') {
      id2emedia[emedia.id_str] = emedia;
    }
  });
  // replace legacy media with extended version
  tweet.entities.media = tweet.entities.media.map(function(media) {
    return id2emedia[media.id_str] || media;
  });
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
  var parsed = {
    href: 'https://twitter.com/' + username + '/status/' + tweet.id_str,
    text: tweet.full_text || tweet.text,
    date: opts.formatDate(tweet.created_at),
    textAdjustment: []
  };
  handleExtendedEntities(tweet);
  urlPreParsers.forEach(preParseUrl.bind(null, tweet.entities));
  Object.keys(entityParsers).forEach(function(type) {
    parseEntityType(tweet.entities, parsed, type, entityParsers[type]);
  });
  adjustText(parsed);
  return parsed;
}

function htmlTweet(tweet) {
  var content = [
    el('a.date', tweet.date, { href: tweet.href, target: '_blank', rel: 'noopener' }),
    el('.text', tweet.text)
  ];
  if (tweet.photo) {
    var img = el('img', { src: tweet.photo.src });
    content.push(el('a.photo', img, { href: tweet.photo.url,  target: '_blank', rel: 'noopener' }));
  }
  if (tweet.iframe) {
    content.push(el('iframe', { src: tweet.iframe.src, 'class': tweet.iframe.service }));
  }
  if (tweet.video) {
    var sources = Object.keys(tweet.video.source)
      .map(function(type) {
        return el('source', {
          src: tweet.video.source[type],
          type: type
        });
      })
      .join('');
    content.push(el('video', sources, {
      controls: '',
      poster: tweet.video.poster
    }));
  }

  return content.join('');
}


function tweet2html(tweet, username, opts) {
  opts = opts || {
    formatDate: formatDate
  };
  return htmlTweet(parseTweet(tweet, username, opts));
}

