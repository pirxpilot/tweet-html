var test = require('tape');
var tweet2html = require('..');

var opts = {
  formatDate: function() { return '3 days ago'; }
};

// before
var jsdom = require('jsdom-global')();

test('should parse urls and hashtags', function(t) {
  var html = [
    '<a href="https://twitter.com/KillingtonMtn/status/412708201784569856" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">',
      'The Gift of Life Marathon Blood Drive is gunning for the national record tomorrow - help out if you can! ',
      '<a href="http://giftoflifemarathon.com/" target="_blank">giftoflifemarathon.com</a> ',
      '<a href="https://twitter.com/search/%23vermont" target="_blank">#vermont</a>',
    '</div>'
  ].join('');

  var data = require('./hashtags.json');
  t.plan(1);
  t.equal(tweet2html(data.tweets[0], 'KillingtonMtn', opts), html);
});


test('should parse user mentions', function(t) {
  var html = [
    '<a href="https://twitter.com/Alta/status/413730533345337344" target="_blank" class="date">',
      '3 days ago</a>',
    '<div class="text">',
    'Last chance to purchase your ',
    '<a href="https://twitter.com/intent/user?user_id=741553663" target="_blank">@Mountain Collective</a> ',
    'and make this the best season yet! ',
    '<a href="http://ow.ly/rVl4M" target="_blank">ow.ly/rVl4M</a> ',
    '<a href="http://ow.ly/i/44H6o" target="_blank">ow.ly/i/44H6o</a>',
    '</div>'
  ].join('');
  var data = require('./mentions.json');
  t.plan(1);
  t.equal(tweet2html(data.tweets[0], 'Alta', opts), html);
});


test('should parse photos', function(t) {
  var html = [
    '<a href="https://twitter.com/KillingtonMtn/status/413306301343465473" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">',
      'Bear Mountain OPENS this afternoon. Check the conditions page for the latest information. ',
      '<a href="http://www.killington.com/conditions" target="_blank">killington.com/conditions</a> ',
    '</div>',
    '<a href="http://twitter.com/KillingtonMtn/status/413306301343465473/photo/1" target="_blank" class="photo">',
      '<img src="https://pbs.twimg.com/media/Bbxb5CuCAAAQ50E.jpg">',
    '</a>'
  ].join('');
  var data = require('./photos.json');
  t.plan(1);
  t.equal(tweet2html(data.tweets[0], 'KillingtonMtn', opts), html);
});

test('should parse vine', function(t) {
  var html = [
    '<a href="https://twitter.com/stratton/status/413684211087048704" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">Look for the East Byrneside boarder cross course this weekend! ',
    '</div>',
    '<iframe src="//vine.co/v/h0UBzVLzA5O/embed/simple" class="video vine"></iframe>'
  ].join('');
  var data = require('./vine.json');
  t.plan(1);
  t.equal(tweet2html(data.tweets[0], 'stratton', opts), html);
});

test('should parse youtube videos', function(t) {
  var html = [
    '<a href="https://twitter.com/stratton/status/413440560104345600" target="_blank" class="date">',
    '3 days ago</a>',
    '<div class="text">There\'s still time to have breakfast with santa this Sat or Sun',
    ' in the LDR from 10am - 2pm. 208-622-2800 for info. ',
    '</div>',
    '<iframe src="//www.youtube.com/embed/j21KKhcf-5s?autohide=1&modestbranding=1&rel=0&theme=light" class="video youtube"></iframe>'
  ].join('');
  var data = require('./youtube.json');

  t.plan(1);
  t.equal(tweet2html(data.tweets[0], 'stratton', opts), html);
});

test('should parse youtube videos with extra params', function(t) {
  var html = [
    '<a href="https://twitter.com/stratton/status/418773517224521729" target="_blank" class="date">',
    '3 days ago',
    '</a>',
    '<div class="text">',
    'Less Talk more STASH. The Stash opens this Saturday.\n',
    '</div>',
    '<iframe src="//www.youtube.com/embed/Evv5DXz2HH4?autohide=1&modestbranding=1&rel=0&theme=light" class="video youtube"></iframe>'
  ].join('');
  var data = require('./youtube.json');
  t.plan(1);
  t.equal(tweet2html(data.tweets[1], 'stratton', opts), html);
});

test('should parse vimeo videos', function(t) {
  var html = [
    '<a href="https://twitter.com/telluride/status/414158499073908737" target="_blank" class="date">',
    '3 days ago',
    '</a>',
    '<div class="text">',
      'It\'s going to be a powder day for the Revelation Bowl opening tomorrow. ',
      '<a href="https://twitter.com/search/%23Telluride" target="_blank">#Telluride</a> ',
      '<a href="https://twitter.com/search/%23PowderAlert" target="_blank">#PowderAlert</a> ',
    '</div>',
    '<iframe src="//player.vimeo.com/video/58833057" class="video vimeo"></iframe>'
  ].join('');
  var data = require('./vimeo.json');
  t.plan(1);
  t.equal(tweet2html(data.tweets[0], 'telluride', opts), html);
});

test('should parse instagrams', function(t) {
  var html = [
    '<a href="https://twitter.com/KillingtonMtn/status/413793572409061376" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">',
      '<a href="https://twitter.com/search/%23theBeast" target="_blank">#theBeast</a> ',
      'is open for exploration! ',
    '</div>',
    '<a href="http://instagram.com/p/iHpOpZjH3F/" target="_blank" class="photo">',
      '<img src="http://instagr.am/p/iHpOpZjH3F/media/?size=m">',
    '</a>'
  ].join('');
  var data = require('./instagram.json');
  t.plan(1);
  t.equal(tweet2html(data.tweets[0], 'KillingtonMtn', opts), html);
});

test('should parse extended tweet format', function(t) {
  var html = [
    '<a href="https://twitter.com/Furkot/status/793223177853931554" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">',
      'New feature: we support <a href="https://twitter.com/intent/user?user_id=15324722" target="_blank">@Garmin</a>',
      ' CSV format for imports.\n',
      'Which means you can now use CSV files from ',
      '<a href="https://twitter.com/intent/user?user_id=515999124" target="_blank">@POI_Factory</a>\n',
      '<a href="https://help.furkot.com/how-to/import.html" target="_blank">help.furkot.com/how-to/import.…</a>',
    '</div>'
  ].join('');
  var data = require('./extended.json');
  t.plan(1);
  t.equal(tweet2html(data, 'Furkot', opts), html);
});

test('should parse tweet with astral plan Unicode characters', function(t) {
  var html = [
    '<a href="https://twitter.com/Furkot/status/919977363235991552" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">',
      'The Big 5 is the best deal of the year! Save 20% on a 5 day lift ticket. ',
      'Buy online today, quantities limited. ',
      '<img class="emoji" draggable="false" alt="⛷️" src="https://twemoji.maxcdn.com/v/13.0.0/svg/26f7.svg"/>',
      '<img class="emoji" draggable="false" alt="🏂" src="https://twemoji.maxcdn.com/v/13.0.0/svg/1f3c2.svg"/> ',
      '<a href="http://bit.ly/2zs8Ayl" target="_blank">bit.ly/2zs8Ayl</a> ',
    '</div>',
    '<a href="https://twitter.com/bigskyresort/status/919977363235991552/video/1" target="_blank" class="photo">',
      '<img src="https://pbs.twimg.com/ext_tw_video_thumb/919976809772367872/pu/img/dad49vapKqgZHzWv.jpg">',
    '</a>'
  ].join('');
  var data = require('./emojis.json');
  t.plan(1);
  t.equal(tweet2html(data, 'Furkot', opts), html);
});

test('should parse native video', function(t) {
  var html = [
    '<a href="https://twitter.com/bigskyresort/status/919977363235991552" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">',
      'The Big 5 is the best deal of the year! Save 20% on a 5 day lift ticket. ',
      'Buy online today, quantities limited. ',
      '<a href="http://bit.ly/2zs8Ayl" target="_blank">bit.ly/2zs8Ayl</a> ',
    '</div>',
    '<video controls="" poster="https://pbs.twimg.com/ext_tw_video_thumb/919976809772367872/pu/img/dad49vapKqgZHzWv.jpg">',
      '<source src="https://video.twimg.com/ext_tw_video/919976809772367872/pu/vid/480x480/EUqOFoQjr_qg1cWJ.mp4" type="video/mp4">',
      '<source src="https://video.twimg.com/ext_tw_video/919976809772367872/pu/pl/6doXgOTC0BLrjddT.m3u8" type="application/x-mpegURL">',
    '</video>'
  ].join('');
  var data = require('./video.json');
  t.plan(1);
  t.equal(tweet2html(data, 'bigskyresort', opts), html);
});

test('should extended compatibility stream events', function(t) {
  var html = [
    '<a href="https://twitter.com/PUBG_help/status/960897321608339456" target="_blank" class="date">',
      '3 days ago',
    '</a>',
    '<div class="text">',
      '<a href="https://twitter.com/intent/user?user_id=948192552" target="_blank">',
        '@Alejandro LeGnØ',
      '</a>',
      ' If you suspect a player of cheating please report them in game and to our support page if you have additional evidence such as video. -D',
      '\n',
      '\n',
      '<a href="https://pubgsupport.zendesk.com/hc/en-us" target="_blank">',
      'pubgsupport.zendesk.com/hc/en-us',
      '</a>',
    '</div>'
  ].join('');
  var data = require('./extended_stream.json');
  t.plan(1);
  t.equal(tweet2html(data, 'PUBG_help', opts), html);
});

// after
jsdom();
