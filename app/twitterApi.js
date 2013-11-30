/*

Your application's OAuth settings. Keep the "Consumer secret" a secret. This key should never be human-readable in your application.

Access level	 Read, write, and direct messages 
About the application permission model
Consumer key	cghIPQ5xAS8H3WlDkyiURw
Consumer secret	KbVoamKQidrhk5tdo6HNHx8iKm8kANhkNMSOWr6EidQ
Request token URL	https://api.twitter.com/oauth/request_token
Authorize URL	https://api.twitter.com/oauth/authorize
Access token URL	https://api.twitter.com/oauth/access_token
Callback URL	http://mergify.com/twitter/test.html
Sign in with Twitter	Yes


Access token	16912759-3Ma5nGV1U3WD2zoN7c4Alj0jCgsDsMssaN3yXFBWT
Access token secret	P22wjAeEnLXRAxVKbG4JzCjuAka0PMU3ldO87yrmZOlv3
Access level	Read-only

*/


var querystring = require('querystring'),
	restify = require('restify');

var Twit = require('twit');

var twitterApi = function(){
	
	var API_BASE_URL		= "https://api.twitter.com",
		SELF_FEED_PATH		= "/1.1/statuses/home_timeline.json";
	
	return {
		
		getUserFeed: function(req, callback, scope){
			
			
			var T = new Twit({
			    consumer_key:         'cghIPQ5xAS8H3WlDkyiURw'
			  , consumer_secret:      'KbVoamKQidrhk5tdo6HNHx8iKm8kANhkNMSOWr6EidQ'
			  , access_token:         '16912759-3Ma5nGV1U3WD2zoN7c4Alj0jCgsDsMssaN3yXFBWT'
			  , access_token_secret:  'P22wjAeEnLXRAxVKbG4JzCjuAka0PMU3ldO87yrmZOlv3'
			});
			
			T.get('statuses/home_timeline', { count: 3 }, function(err, obj) {
				console.log(arguments);
  				if(err && err.message){
					callback.call(scope, {
						error: err
					});
					return;
				}
		
				callback.call(scope, obj);
				return;
			});

			
		}
	
	}; //  return 
	
}();


module.exports = twitterApi;
