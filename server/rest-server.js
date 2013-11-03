/* jshint node: true, quotmark:false */
"use strict";

var restify = require('restify');


var restServer = function(){
	
	var SERVER_NAME		= "Me Instagram Service",
		DEFAULT_VERSION = "0.0.1",
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
				
				server.listen(8080, function() {
				  console.log('%s v%s listening at %s', server.name, server.versions, server.url);
				});
			}
			return server;
		}
		
	});
}();

module.exports = restServer;