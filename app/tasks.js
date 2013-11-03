/* jshint node: true, quotmark:false */
"use strict";

var getPosts = function(req){
	var data = {
		posts: req.params.name
	};
	return data;
};

module.exports = {
	getPosts: getPosts
};