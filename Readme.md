[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]
[![Dev Dependency Status][deps-dev-image]][deps-dev-url]

  reparse tweets returned by twitter API to HTML

## Installation

Install with [npm](http://npmjs.org):

    $ npm install tweet-html

## API

### tweet2html(tweet, username[, options])

Parse [tweet entities] contained in [tweet] object returned by one of the [Twitter API] calls.

- `tweet` - tweet object
- `username` -
- `opts` - _optional_ - at the moment only `formatDate` is supported; if not provided `created_at`
  dates are formated to display _3 hours ago_ or _a year ago_

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

[tweet]: https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object
[tweet entities]: https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/entities-object
[Twitter API]: https://developer.twitter.com/en/docs/api-reference-index

[npm-image]: https://img.shields.io/npm/v/tweet-html.svg
[npm-url]: https://npmjs.org/package/tweet-html

[build-url]: https://travis-ci.org/pirxpilot/tweet-html
[build-image]: https://img.shields.io/travis/pirxpilot/tweet-html.svg

[deps-image]: https://img.shields.io/david/pirxpilot/tweet-html.svg
[deps-url]: https://david-dm.org/pirxpilot/tweet-html

[deps-dev-image]: https://img.shields.io/david/dev/pirxpilot/tweet-html.svg
[deps-dev-url]: https://david-dm.org/pirxpilot/tweet-html?type=dev
