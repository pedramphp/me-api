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
				path:		'/instagram/auth/:authToken',
				versions:	'0.0.1',
				task:		'auth',
				vendor:		tasks.INSTAGRAM,
				reqType:	'get'
			},{
				path:		'/instagram/user_feed/:accessToken',
				versions:	'0.0.1',
				task:		'getUserFeed',
				vendor:		tasks.INSTAGRAM,
				reqType:	'get'
			},{
				path:		'/facebook/auth/:authToken',
				versions:	'0.0.1',
				tast:		'auth',
				vendor:		tasks.FACEBOOK,
				reqType:	'get'
			}];

			// loop throgh all paths and initiate server request
			paths.forEach(function(item){

				server[item.reqType]({
					path:		item.path,
					versions:	item.versions
				}, function(req, res, next){
					
					tasks[item.task](req, item.vendor, function(data){
						that.respond(data, res, next);
					}, that);

				});
			
			});
		},

		respond: function(data, res, next){
			if(data.error){
				console.log(new Error(data.error));
				return next(new Error(data.error));
			}
			console.log("response:", data);
			res.json(data);
			next();
		}
	};
}();
app.init();