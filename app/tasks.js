/* jshint node: true, quotmark:false */
"use strict";

var querystring = require('querystring');
var restify = require('restify');

var CLIENT_ID		= "71c7cf49cc78468b9de3f1a6b0985c81",
	CLIENT_SECRET	= "4c442a0662ee467197c61dafdd259cd9",
	GRANT_TYPE		= "authorization_code",
	REDIRECT_URL	= "http://mergify.com/instagram/test",
	API_BASE_URL	= "https://api.instagram.com",
	SELF_FEED		= "/v1/users/self/feed/",
	AUTH_ACESS_TOKEN = "/oauth/access_token";

var getPosts = function(req, resCallback, scope){
	var data = {
		posts: req.params.name
	};
	resCallback.call(scope, data);
};

var auth = function(req, resCallback, scope){
	
	// this should become an NPM
	var client = restify.createStringClient({
	  url: API_BASE_URL,
	  version: '*'
	});
	
	var data = {
		client_id:		CLIENT_ID,
		client_secret:	CLIENT_SECRET,
		grant_type:		GRANT_TYPE,
		redirect_uri:	REDIRECT_URL,
		code:			req.params.auth
	};

	client.post(AUTH_ACESS_TOKEN, data, function(err, req, res, obj){
		if(err){
			resCallback.call(scope, {
				error: err
			});
			return;
		}
		resCallback.call(scope, JSON.parse(obj));
	});
};

var getUserFeed = function(req, resCallback, scope){
	
	
	// this should become an NPM
	var client = restify.createStringClient({
	  url: API_BASE_URL,
	  version: '*'
	});
	
	var data = {
		access_token: req.params.access_token
	};
	client.get(SELF_FEED +"?"+ querystring.stringify(data), function(err, req, res, obj){
		
		if(err && err.message){
			resCallback.call(scope, {
				error: err
			});
			return;
		}

		resCallback.call(scope, JSON.parse(obj));
		return;
	});
};



module.exports = {
	getPosts:	getPosts,
	auth:		auth,
	getUserFeed: getUserFeed
};

/*
{"access_token":"353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b",
"user":{"username":"mahdipedram","bio":"","website":"","profile_picture":"http://images.ak.instagram.com/profiles/profile_353722391_75sq_1366096725.jpg","full_name":"Mahdi PedramRazi","id":"353722391"}}
*/