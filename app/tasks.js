/* jshint node: true, quotmark:false */
"use strict";


var facebookApi =  require("./facebookApi"),
	instagramApi =  require("./instagramApi"),
	twitterApi =  require("./twitterApi"),
	
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
				response,
				reqData;
				
			response = function(responseObj){
				resCallback.call(scope, responseObj);
			}
			
			if(vendor == this.FACEBOOK){
				reqData = {
					accessToken: accessToken,
					start: 0,
					limit: 10
				};
				facebookApi.getUserFeed(reqData, response, this);
			
			}else if(vendor == this.INSTAGRAM){
				console.log(accessToken);
				instagramApi.getUserFeed(accessToken, response, this);
				
			}else if(vendor == this.TWITTER){
				twitterApi.getUserFeed(accessToken, response, this);	
			}			
		}
	};
}();


module.exports = tasks;
