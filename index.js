/* jshint node: true, quotmark:false */
"use strict";

var
server	= require("./server/rest-server").getServer(),
tasks	= require("./app/tasks"),
app		= function(){
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
			}];

			// loop throgh all paths and initiate server request
			paths.forEach(function(item){

				server[item.reqType]({
					path:		item.path,
					versions:	item.versions
				}, function(req, res, next){

					var data = tasks[item.task](req);
					that.respond(data, res, next);

				});
			
			});
		},

		respond: function(data, res, next){
			res.json(data);
			return next();
		}
	};
}();
app.init();