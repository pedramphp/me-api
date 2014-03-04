/* jshint node: true, quotmark:false */
"use strict";

var server = require("./server/rest-server").getServer(),
	tasks = require("./modules/tasks");

var app = function(){
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
				path:		'/facebook/user_feed/:accessToken',
				versions:	'0.0.1',
				task:		'getUserFeed',
				vendor:		tasks.FACEBOOK,
				reqType:	'get'
			},{
				path:		'/twitter/user_feed/:accessToken',
				versions:	'0.0.1',
				task:		'getUserFeed',
				vendor:		tasks.TWITTER,
				reqType:	'get'
			},{
				path:		'/timeline/home/',
				versions:	'0.0.1',
				task:		'getHomeTimeline',
				reqType:	'get'
			}];

			// loop throgh all paths and initiate server request
			paths.forEach(this.registerRoute.bind(this));
		},

		registerRoute: function(item){
			
			var that = this,
				config = {
					path:		item.path,
					versions:	item.versions
				},
				vendor =  item.vendor || null,
				routeCallback;

			routeCallback = function(req, res, next){

				var taskCallback;
				if(!tasks[item.task]){
					that.output({ error: "app initPaths : Task is misspelled" }, res, next);
					return;
				}

				taskCallback = function(data){
					that.output(data, res, next);
				};
				
				// load tasks.
				tasks[item.task](req, vendor, taskCallback, that);

			};

			// register route
			server[item.reqType](config, routeCallback);
		},

		output: function(data, res, next){
			if(data.error){
				console.log(new Error(data.error));
				return next(new Error(data.error));
			}
			//console.log("response:", data);
			res.json(data);
			next();
		}
	};
}();

app.init();