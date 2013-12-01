/*
App ID:	261731650641340
App Secret:	a5bde0c5259b063357b932cfd03b616c


accessToken: "CAADuCyYQHbwBACOP3AseylGj8lWY3G47NXjQBssXrOUHrUPizjICJCuNqgxp25P3zieAcDYhV8dwHZACDFZARhLi0XS2LZAXwtEcFqdYcQWfwQA540PZBOxMYWJGUKHZCEr7mZCeBi0WDF4CXvygDcKW9p4rflCqcrMfVTLMZCHLZCphTJRwuBjGSHGnqzXvSloZD"
expiresIn: 4760
signedRequest: "rqhxNDcm1beTALWjgbQMtmTXx6ZsG8Xo8LntGjZkEpw.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUURLRHZ5bGVEYmJESVV5QVFPRmRMUE5ZeUo3VVNwZ0p0dnU4Y2t6cWg0MGNyaWpVMFdBSUxmYi1QZG9WeGljeHRrRkVxckROdXZGVXFtR2VYWG5JWnl1ZnRBQVM4UHEtUUZtV1AyUTBRVjlnRFphM1owWExwdWx5S0t1Rm9UdUJaTlh0UmxSQkxRRGVUNFM4SnhsUk9xZ2RTOXFlSTZRM1NfaU1SZFc3cE9WdFBfWWV1Y2dCaWlLc3puV3BvSmRQeGpkWGVpSEwzU1VfZHdlazctbkhNamxzZmZ5RzZDVERobkcwZHFWSmkyVDdiUUJ6a29hOUViQjhQakh3YmpMa190MmxMa2lsNERsQ0ZUVVgxUTFqV3dHdG1mQzY4Tl91TnQ5anBlVDF6VmoxRDM2d3h4MDJ6VndXSDVTN1VJX1p2TFpQOThHQkVyNnlRc3J0SFZQVndScmJxdGFBSHNrZzFic19JWjF0M05ueEEiLCJpc3N1ZWRfYXQiOjEzODM2MzcyNDAsInVzZXJfaWQiOiI1NjkyMzM4NzUifQ"
userID: "569233875"

https://graph.facebook.com/me/home/?access_token=CAADuCyYQHbwBACOP3AseylGj8lWY3G47NXjQBssXrOUHrUPizjICJCuNqgxp25P3zieAcDYhV8dwHZACDFZARhLi0XS2LZAXwtEcFqdYcQWfwQA540PZBOxMYWJGUKHZCEr7mZCeBi0WDF4CXvygDcKW9p4rflCqcrMfVTLMZCHLZCphTJRwuBjGSHGnqzXvSloZD

https://graph.facebook.com/me/home/?before=0&limit=5&access_token=CAADuCyYQHbwBACOP3AseylGj8lWY3G47NXjQBssXrOUHrUPizjICJCuNqgxp25P3zieAcDYhV8dwHZACDFZARhLi0XS2LZAXwtEcFqdYcQWfwQA540PZBOxMYWJGUKHZCEr7mZCeBi0WDF4CXvygDcKW9p4rflCqcrMfVTLMZCHLZCphTJRwuBjGSHGnqzXvSloZD

http://216.70.108.50:7000/facebook/user_feed/CAADuCyYQHbwBACOP3AseylGj8lWY3G47NXjQBssXrOUHrUPizjICJCuNqgxp25P3zieAcDYhV8dwHZACDFZARhLi0XS2LZAXwtEcFqdYcQWfwQA540PZBOxMYWJGUKHZCEr7mZCeBi0WDF4CXvygDcKW9p4rflCqcrMfVTLMZCHLZCphTJRwuBjGSHGnqzXvSloZD
* 
* * 
* */
var querystring = require('querystring'),
	restify = require('restify'),
	Q = require('q');

var facebookApi = function(){
	
	var API_BASE_URL		= "https://graph.facebook.com",
		SELF_FEED_PATH		= "/me/home/";
	
	return {
		
		getUserFeed: function(config, callback, scope){
			
			var client,
				data,
				clientUrl;
			
			client = restify.createStringClient({
			  url: API_BASE_URL,
			  version: '*'
			});
			
			data = {
				access_token: config.accessToken,
				limit: config.limit || 10
			};
			
			if(config.until){
				data.until = config.until || 0
			}
			
			clientUrl = SELF_FEED_PATH + "?" + querystring.stringify(data);
			console.log(clientUrl);
			client.get(clientUrl, function(err, req, res, obj){
				
				if(err && err.message){
					callback.call(scope, {
						error: err
					});
					return;
				}
		
				callback.call(scope, JSON.parse(obj));
				return;
			});
		},
		
		getFeedPromise: function(config){
			var deferred,
				data = {
					accessToken:	config.accessToken,
					limit: 			config.limit || 10,
					until:			config.until || 0
				};
			
			deferred = Q.defer();
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


module.exports = facebookApi;
