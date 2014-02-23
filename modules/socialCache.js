"use strict";

var c = require("./common"),
	redis = require("redis"),
	client = null;

var socialCache = function(){
	
	return {
		init: function(){

			this.initCache();

		},

		initCache: function(){

			if(client){
				return;
			}

			client = redis.createClient();

			client.on("error", function (err) {
				c.logger.log("redis cache error", err);
			});

			client.on("connect", function () {
			
			});

		}
	};
};

module.exports = socialCache;