var ago = require('ago');
var el = require('el');
var uslice = require('unicode-substring');

module.exports = tweet2html;

function formatDate(created_at) {
  // Date format: ddd MMM DD HH:mm:ss ZZ YYYY
  return ago(new Date(created_at));
}

function adjustText(tweet) {
  var text = [];
  var index = 0;
  tweet.textAdjustment
    .sort(function(a, b) {
      return a.indices[0] - b.indices[0];
    })
    .forEach(function(adj) {
      text.push(uslice(tweet.text, index, adj.indices[0]));
      text.push(adj.text);
      index = adj.indices[1];
    });
  if (index > 0) {
    text.push(uslice(tweet.text, index));
    tweet.text = text.join('');
  }
  delete tweet.textAdjustment;
}

function createTextAdjustment(opt) {
  var ta = {
    indices: opt.indices,
    text: ''
  };
  if (opt.text && opt.href) {
    ta.text = el('a', opt.text, { href: opt.href, target: "_blank" });
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
    if (media.type === 'photo') {
      data.photo = {
        url: media.expanded_url,
        src: media.media_url_https
      };
      return data;
    } else if (media.type === 'youtube' || media.type === 'vimeo' || media.type === 'vine') {
      data.iframe = {
        src: media.media_url_https,
        service: 'video ' + media.type
      };
      return data;
    }
  },
  hashtags: function(tag) {
    return {
      href: 'https://twitter.com/search/%23' + tag.text,
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
    regex: /https?:\/\/instagram.com\/p\/([^\s\/]+)\/?/,
    toMediaUrl: function(match) {
      return 'http://instagr.am/p/' + match[1] + '/media/?size=m';
    }
  }, {
    type: 'youtube',
    regex: /https?:\/\/(?:youtu.be\/|(?:m|www).youtube.com\/watch\?v=)([^\s&]+)/,
    toMediaUrl: function(match) {
      return '//www.youtube.com/embed/' + match[1] + '?autohide=1&modestbranding=1&rel=0&theme=light';
    }
  }, {
    type: 'vimeo',
    regex: /https?:\/\/vimeo.com\/(\S+)$/,
    toMediaUrl: function(match) {
      return '//player.vimeo.com/video/' + match[1];
    }
 }, {
    type: 'vine',
    regex: /https?:\/\/vine.co\/v\/(\S+)$/,
    toMediaUrl: function(match) {
      return '//vine.co/v/' + match[1] + '/embed/simple';
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

// interesting things about the tweet
// item.created_at
// item.text - tweet text
// item.full_text - tweet text for an untruncated tweet
// item.entities - hashtags, urls, user_mentions, media (type: photo)
function parseTweet(tweet, username, opts) {
  var parsed = {
    href: 'https://twitter.com/' + username + '/status/' + tweet.id_str,
    text: tweet.full_text || tweet.text,
    date: opts.formatDate(tweet.created_at),
    textAdjustment: []
  };
  urlPreParsers.forEach(preParseUrl.bind(null, tweet.entities));
  Object.keys(entityParsers).forEach(function(type) {
    parseEntityType(tweet.entities, parsed, type, entityParsers[type]);
  });
  adjustText(parsed);
  return parsed;
}

function htmlTweet(tweet) {
  var img, content = [
    el('a.date', tweet.date, { href: tweet.href, target: '_blank' }),
    el('.text', tweet.text)
  ];
  if (tweet.photo) {
    img = el('img', { src: tweet.photo.src });
    content.push(el('a.photo', img, { href: tweet.photo.url,  target: '_blank' }));
  }
  if (tweet.iframe) {
    content.push(el('iframe', { src: tweet.iframe.src, 'class': tweet.iframe.service }));
  }

  return content.join('');
}


function tweet2html(tweet, username, opts) {
  opts = opts || {
    formatDate: formatDate
  };
  return htmlTweet(parseTweet(tweet, username, opts));
}

