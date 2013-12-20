var tweet2html = require('..');
var tweets = require('./tweets.json').tweets;

/* global describe, it */


var opts = {
  formatDate: function() { return '3 days ago'; }
}

describe('tweet2html', function() {

  it('should parse urls and hashtags', function() {
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

    tweet2html(tweets[2], 'KillingtonMtn', opts).should.eql(html);
  });


  it('should parse urls', function() {
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
    tweet2html(tweets[3], 'Alta', opts).should.eql(html);
  });


  it('should parse photos', function() {
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
    tweet2html(tweets[0], 'KillingtonMtn', opts).should.eql(html);
  });

  it('should parse instagrams', function() {
    var html = [
      '<a href="https://twitter.com/stratton/status/413684211087048704" target="_blank" class="date">',
        '3 days ago',
      '</a>',
      '<div class="text">Look for the East Byrneside boarder cross course this weekend! ',
      '</div>',
      '<iframe src="https://vine.co/v/h0UBzVLzA5O/embed/simple" class="video vine"></iframe>'
    ].join('');
    tweet2html(tweets[4], 'stratton', opts).should.eql(html);
  });

  it('should parse youtube videos', function() {
    var html = [
      '<a href="https://twitter.com/stratton/status/413440560104345600" target="_blank" class="date">',
      '3 days ago</a>',
      '<div class="text">There\'s still time to have breakfast with santa this Sat or Sun',
      ' in the LDR from 10am - 2pm. 208-622-2800 for info. ',
      '</div>',
      '<iframe src="http://www.youtube.com/embed/j21KKhcf-5s?autohide=1&modestbranding=1&rel=0&theme=light" class="video youtube"></iframe>'
    ].join('');
    tweet2html(tweets[5], 'stratton', opts).should.eql(html);
  });
  it('should parse vimeo videos');
  it('should parse vine videos');
});