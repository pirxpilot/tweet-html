var tweet2html = require('..');

/* global describe, it */


var opts = {
  formatDate: function() { return '3 days ago'; }
}

describe('tweet2html', function() {

  it('should parse urls and hashtags', function() {
    var tweet = require('./hashtags').tweets[0];
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

    tweet2html(tweet, 'KillingtonMtn', opts).should.eql(html);
  });


  it('should parse user mentions', function() {
    var tweet = require('./mentions').tweets[0];
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
    tweet2html(tweet, 'Alta', opts).should.eql(html);
  });


  it('should parse photos', function() {
    var tweet = require('./photos').tweets[0];
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
    tweet2html(tweet, 'KillingtonMtn', opts).should.eql(html);
  });

  it('should parse vine', function() {
    var tweet = require('./vine').tweets[0];
    var html = [
      '<a href="https://twitter.com/stratton/status/413684211087048704" target="_blank" class="date">',
        '3 days ago',
      '</a>',
      '<div class="text">Look for the East Byrneside boarder cross course this weekend! ',
      '</div>',
      '<iframe src="https://vine.co/v/h0UBzVLzA5O/embed/simple" class="video vine"></iframe>'
    ].join('');
    tweet2html(tweet, 'stratton', opts).should.eql(html);
  });

  it('should parse youtube videos', function() {
    var tweet = require('./youtube').tweets[0];
    var html = [
      '<a href="https://twitter.com/stratton/status/413440560104345600" target="_blank" class="date">',
      '3 days ago</a>',
      '<div class="text">There\'s still time to have breakfast with santa this Sat or Sun',
      ' in the LDR from 10am - 2pm. 208-622-2800 for info. ',
      '</div>',
      '<iframe src="http://www.youtube.com/embed/j21KKhcf-5s?autohide=1&modestbranding=1&rel=0&theme=light" class="video youtube"></iframe>'
    ].join('');
    tweet2html(tweet, 'stratton', opts).should.eql(html);
  });

  it('should parse youtube videos with extra params', function() {
    var tweet = require('./youtube').tweets[1];
    var html = [
      '<a href="https://twitter.com/stratton/status/418773517224521729" target="_blank" class="date">',
      '3 days ago',
      '</a>',
      '<div class="text">',
      'Less Talk more STASH. The Stash opens this Saturday.\n',
      '</div>',
      '<iframe src="http://www.youtube.com/embed/Evv5DXz2HH4?autohide=1&modestbranding=1&rel=0&theme=light" class="video youtube"></iframe>'
    ].join('');
    tweet2html(tweet, 'stratton', opts).should.eql(html);
  });

  it('should parse vimeo videos', function() {
    var tweet = require('./vimeo').tweets[0];
    var html = [
      '<a href="https://twitter.com/telluride/status/414158499073908737" target="_blank" class="date">',
      '3 days ago',
      '</a>',
      '<div class="text">',
        'It\'s going to be a powder day for the Revelation Bowl opening tomorrow. ',
        '<a href="https://twitter.com/search/%23Telluride" target="_blank">#Telluride</a> ',
        '<a href="https://twitter.com/search/%23PowderAlert" target="_blank">#PowderAlert</a> ',
      '</div>',
      '<iframe src="http://player.vimeo.com/video/58833057" class="video vimeo"></iframe>'
    ].join('');
    tweet2html(tweet, 'telluride', opts).should.eql(html);
  });

  it('should parse instagrams', function() {
    var tweet = require('./instagram').tweets[0];
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
    tweet2html(tweet, 'KillingtonMtn', opts).should.eql(html);
  });
});