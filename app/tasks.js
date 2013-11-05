/* jshint node: true, quotmark:false */
"use strict";


var facebookApi =  require("./facebookApi"),
	instagramApi =  require("./instagramApi"),
	tasks;


tasks = function(){
	return {
		FACEBOOK:	"facebook",
		INSTAGRAM:	"instagram",
		TWITTER:	"twitter",
		auth: function(req, vendor, resCallback, scope){
			
			//authToken needs validation
			var authToken = req.params.authToken,
				response;
				
			response = function(responseObj){
				
				// before calling the callback function it needs to save the auth token in the database.
				resCallback.call(scope, responseObj);
			}
			x
			if(vendor == this.FACEBOOK){
			
				facebookApi.auth(authToken, response, this);
			
			}else if(vendor == this.INSTAGRAM){
					
				instagramApi.auth(authToken, response, this);
				
			}
		},
		
		getUserFeed: function(req, vendor, resCallback, scope){
			var accessToken = req.params.accessToken,
				response;
				
			response = function(responseObj){
				resCallback.call(scope, responseObj);
			}
			
			if(vendor == this.FACEBOOK){
			
				facebookApi.getUserFeed(accessToken, response, this);
			
			}else if(vendor == this.INSTAGRAM){
				console.log(accessToken);
				instagramApi.getUserFeed(accessToken, response, this);
				
			}			
		}
	};
}();


module.exports = tasks;

/*
{"access_token":"353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b",
"user":{"username":"mahdipedram","bio":"","website":"","profile_picture":"http://images.ak.instagram.com/profiles/profile_353722391_75sq_1366096725.jpg","full_name":"Mahdi PedramRazi","id":"353722391"}}
*/