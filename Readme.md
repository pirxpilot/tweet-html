[![Build Status](https://secure.travis-ci.org/code42day/tweet-html.png)](http://travis-ci.org/code42day/tweet-html)
[![Dependency Status](https://gemnasium.com/code42day/tweet-html.png)](https://gemnasium.com/code42day/tweet-html)
[![NPM version](https://badge.fury.io/js/tweet-html.png)](http://badge.fury.io/js/tweet-html)
# tweet-html

  reparse tweets returned by twitter API to HTML

## Installation

For browser use install with [component(1)](http://component.io):

    $ component install code42day/tweet-html

For server side use install with [npm](http://npmjs.org):

    $ npm install tweet-html

## API

### tweet2html(tweet, username[, options])

Parse [tweet entities] contained in [tweet] object returned by one of the [Twitter API] calls.

- `tweet` - tweet object
- `username` -
- `opts` - _optional_ - at the moment only `formatDate` is supported; if not provided `created_at`
  dates are formated with [Moment] `fromNow` function resulting in Dates displayed as _3 hours ago_
  or _a year ago_


In addition to usual suspects (user mentions, hashtags, urls) it also parses and embeds vine,
instagram, youtube and vimeo links.

Given:

```json
{
  "id_str": "413684211087048704",
  "created_at": "Thu Dec 19 14:56:16 +0000 2013",
  "text": "Look for the East Byrneside boarder cross course this weekend! https://t.co/zbGXyOjmlr",
  "entities": {
    "urls": [
      {
        "url": "https://t.co/zbGXyOjmlr",
        "expanded_url": "https://vine.co/v/h0UBzVLzA5O",
        "display_url": "vine.co/v/h0UBzVLzA5O",
        "indices": [
          63,
          86
        ]
      }
    ]
  }
}
```

Renders:

```html
<a href="https://twitter.com/stratton/status/413684211087048704" target="_blank" class="date">
  '3 days ago'
</a>
<div class="text">Look for the East Byrneside boarder cross course this weekend!</div>
<iframe src="https://vine.co/v/h0UBzVLzA5O/embed/simple" class="video vine"></iframe>
```

Check [tests](test/tweet-html.js) for more examples.


## License

  MIT

[tweet]: https://dev.twitter.com/docs/platform-objects/tweets
[tweet entities]: https://dev.twitter.com/docs/entities
[Moment]: http://momentjs.com/