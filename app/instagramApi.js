/*
{"access_token":"353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b",
"user":{"username":"mahdipedram","bio":"","website":"","profile_picture":"http://images.ak.instagram.com/profiles/profile_353722391_75sq_1366096725.jpg","full_name":"Mahdi PedramRazi","id":"353722391"}}
*/

var querystring = require('querystring'),
	restify = require('restify');


var instagramApi = function(){
	
	var CLIENT_ID		= "71c7cf49cc78468b9de3f1a6b0985c81",
	CLIENT_SECRET		= "4c442a0662ee467197c61dafdd259cd9",
	GRANT_TYPE			= "authorization_code",
	REDIRECT_URL		= "http://mergify.com/instagram/test",
	API_BASE_URL		= "https://api.instagram.com",
	SELF_FEED_PATH		= "/v1/users/self/feed/",
	AUTH_ACESS_TOKEN_PATH = "/oauth/access_token";	
	
	return {
		auth: function(authToken, callback, scope){
			var client,
				data;
			
			client = restify.createStringClient({
			  url: API_BASE_URL,
			  version: '*'
			});
			
			data = {
				client_id:		CLIENT_ID,
				client_secret:	CLIENT_SECRET,
				grant_type:		GRANT_TYPE,
				redirect_uri:	REDIRECT_URL,
				code:			authToken
			};
		
			client.post(AUTH_ACESS_TOKEN_PATH, data, function(err, req, res, obj){
				if(err){
					callback.call(scope, {
						error: err
					});
					return;
				}
				callback.call(scope, JSON.parse(obj));
			});	
		},
		
		getUserFeed: function(accessToken, callback, scope){
			
			var client,
				data,
				clientUrl;
			
			client = restify.createStringClient({
			  url: API_BASE_URL,
			  version: '*'
			});
			
			data = {
				access_token: accessToken,
				count: 10
			};
			
			clientUrl = SELF_FEED_PATH + "?" + querystring.stringify(data);
			
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
		}
	
	}; //  return 
	
}();


module.exports = instagramApi;