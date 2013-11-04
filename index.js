/* jshint node: true, quotmark:false */
"use strict";

var
server = require("./server/rest-server").getServer(),
tasks = require("./app/tasks"),
app = function(){
	return {
		init: function(){
			this.initPaths();
		},
		
		initPaths: function(){
			var that = this,
			paths = [{
				path:		'/getPosts/:name',
				versions:	'0.0.1',
				task:		'getPosts',
				reqType:	'get'
			},{
				path:		'/auth/:auth',
				versions:	'0.0.1',
				task:		'auth',
				reqType:	'get'
			},{
				path:		'/user_feed/:access_token',
				versions:	'0.0.1',
				task:		'getUserFeed',
				reqType:	'get'
			}];

			// loop throgh all paths and initiate server request
			paths.forEach(function(item){

				server[item.reqType]({
					path:		item.path,
					versions:	item.versions
				}, function(req, res, next){

					tasks[item.task](req, function(data){
						that.respond(data, res, next);
					}, that);

				});
			
			});
		},

		respond: function(data, res, next){
			if(data.error){
				
				return next(new Error(data.error));
			}
			console.log("response:", data);
			res.json(data);
			next();
		}
	};
}();
app.init();