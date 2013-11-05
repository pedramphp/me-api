/* jshint node: true, quotmark:false */
"use strict";

var restify = require('restify');


var restServer = function(){
	
	var SERVER_NAME		= "Me Instagram Service",
		SERVER_IP_ADDRESS = "216.70.108.50", // needs to be send as a parameter
		DEFAULT_VERSION = "0.0.1",
		SERVER_PORT = 7000, // needs to be send as a parameter
		server = null;

	return({
		
		init: function(){
			return this.getServer();
		},

		getServer: function(){
			if(!server){
				server = restify.createServer({
					name:		SERVER_NAME,
					version:	DEFAULT_VERSION
				});
				
				server.listen(SERVER_PORT ,SERVER_IP_ADDRESS, function() {
					console.log('%s v%s listening at %s', server.name, server.versions, server.url);
				});
			}
			return server;
		}
		
	});
}();

module.exports = restServer;