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
	restify = require('restify'),
	Q = require('q');

var Twit = require('twit');

var twitterApi = function(){
	
	var API_BASE_URL		= "https://api.twitter.com",
		SELF_FEED_PATH		= "/1.1/statuses/home_timeline.json";
	
	return {
		
		getUserFeed: function(config, callback, scope){
						
			var T = new Twit({
			    consumer_key:         'cghIPQ5xAS8H3WlDkyiURw'
			  , consumer_secret:      'KbVoamKQidrhk5tdo6HNHx8iKm8kANhkNMSOWr6EidQ'
			  , access_token:         '16912759-3Ma5nGV1U3WD2zoN7c4Alj0jCgsDsMssaN3yXFBWT'
			  , access_token_secret:  'P22wjAeEnLXRAxVKbG4JzCjuAka0PMU3ldO87yrmZOlv3'
			});
			
			var data = {
				count: config.count
			};
			
			if(config.max_id){
				data.max_id = config.max_id;
			}
			console.log("twitter call: ",data);
			T.get('statuses/home_timeline', data, function(err, obj) {
				if(err && err.message){
					callback.call(scope, {
						error: err
					});
					return;
				}
		
				callback.call(scope, obj);
				return;
			});
	
		},
		
		getFeedPromise: function(config){
			
			var deferred = Q.defer(),
				data = {
					accessToken:	config.accessToken,
					count: 			config.limit || 10
				};
				
			if(config.lastId){
				data.max_id = config.lastId;
			}
				
			this.getUserFeed(data, function(items){
				if( items.error){
					deferred.reject(new Error(items.error));
					return;
				}
				deferred.resolve(items);
			}, this);
			return deferred.promise;	
					
		}
	
	}; //  return 
	
}();


module.exports = twitterApi;
