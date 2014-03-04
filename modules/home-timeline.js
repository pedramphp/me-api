"use strict";

var facebookApi =  require("./facebookApi"),
	instagramApi =  require("./instagramApi"),
	twitterApi =  require("./twitterApi"),
	moment = require("moment"),
	Q = require('q');

var timeline =  function(){
	var feeds = [];
		
	var PAGE_SIZE = 10;
		
	var fb = {
		TITLE: "FB",
		lastIndex: 0,
		count: 0,
		lastTimestamp: null,
		isAvailable: true,
		config: {
			accessToken: "CAADuCyYQHbwBAPZAG4LiAK3LCldGh7pnCUYj7gV3tADnRu6G1QZBucUuobNb6PXnL3hnvcoieSK6QBt2SVDcUmmt8i7XGDQdpNcbDsV9GIAlXpkV9cMbFwLqb2L1QL8AHUovfZA7wcrma0g5BbfSvmjYCCyNgOKvFVQafuhxxZBiYAvbsO0lnZA3Pbl6VCThM21adxIg7KwZDZD",
			before: 0
		},
		
		setSize: function(size){
			this.config.limit = size;
		},
		
		getPromise: function(){
			this.config.until = this.lastTimestamp || 0;
			return facebookApi.getFeedPromise(this.config)
									.then(this.feedCallback.bind(this))
									.fail(function(error){
										if(error.message){
											error = JSON.parse(error.message);
											if(error.type === "OAuthException"){
												fb.isAvailable = false;
											}
										}
										fb.isAvailable = false;
										console.log("FB Error", error);
									});
		},
		
		feedCallback: function(items){
			this.lastTimestamp = null;
			items.data.forEach(function(item) {
				var date = new Date(item.created_time);
				feeds.push({
					created_time: date.valueOf(),
					type: "fb",
					item: item,
					created_time_string: moment(date.valueOf()).format('MMMM Do YYYY, h:mm:ss a')
				});
			});
			this.count = (items.data && items.data.length) || 0;
		
		}
	};
	
	var twitter = {
			TITLE: "TWITTER",
			count: 0,
			lastIndex: 0,
			lastId: null,
			isAvailable: true,
			config:{
				accessToken: "CAADuCyYQHbwBAHzhspZBlSznNcFnhDXMnmejoVvx82yeKHWirWORkq5VlddWVutORYZAO17ZBLIA9JbX7rt2lgSygCnkRH3RKzq1WZBJC8nSZCmCPJZA8hqTofwy5g20Q0YyaQqsENS8yBgqGpgbgfClhgZCSBi9vt8BBQrycTQcbrFfzmi5dXveolVWbHtTzthw8a4I3thIAZDZD",
				limit: 20
			},

			setSize: function(size){
				this.config.limit = size;
			},
			
			getPromise: function(){
				if(this.lastId){
					this.config.lastId = this.lastId;
				}
				return twitterApi.getFeedPromise(this.config)
									.then(this.feedCallback.bind(this))
									.fail(function( error ){
										console.log("TWITTER Error", error);
										twitter.isAvailable = false;
									});
			},
			
			feedCallback: function(items){
				this.lastId = null;
				items.forEach(function(item) {
					var date = new Date(item.created_at);
					feeds.push({
						created_time: date.valueOf(),
						type: "twitter",
						item: item,
						id: item.id,
						created_time_string: moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')
				
					});
				});
				
				this.count = (items.data && items.data.length) || 0;
			}
	};
	
	var instagram = {
		TITLE: "INSTAGRAM",
		count: 0,
		lastIndex: 0,
		lastId: null,
		isAvailable: true,
		config: {
			accessToken: "353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b",
			limit: 3
		},
		
		setSize: function(size){
			this.config.limit = size;
		},
		
		getPromise: function(){
			if(this.lastId){
				this.config.lastId = this.lastId;
			}
			return instagramApi.getFeedPromise(this.config)
									.then(this.feedCallback.bind(this))
									.fail(function( error ){
										console.log("INSTAGRAM Error", error);
										instagram.isAvailable = false;
									});
		},
		
		feedCallback: function(items){
			
			this.lastId = null;
			items.data.forEach(function(item) {
				
				feeds.push({
					created_time: item.created_time * 1000,
					type: "instagram",
					item: item,
					id: item.id,
					created_time_string: moment(item.created_time * 1000).format('MMMM Do YYYY, h:mm:ss a')
				});
			});
			
			this.count = (items.data && items.data.length) || 0;
		}
	};
	
	var setIndexes = function(socialType){
		var i = 0;
		
		if( socialType == "fb"){
		
			fb.lastIndex = null;
			fb.lastTimestamp = null;
		
		}else if( socialType == "twitter"){
		
			twitter.lastIndex = null;
			twitter.lastId = null;
			
		}else if(socialType == "instagram"){
			
			instagram.lastIndex = null;
			instagram.lastId	= null;
		
		}
		
		
		feeds.forEach(function(item, i) {
			if(item.type == socialType){
				
				if( socialType == "fb"){
					fb.lastIndex = i;
					fb.lastTimestamp = item.created_time / 1000;
					
				}else if( socialType == "twitter"){
					
					twitter.lastIndex = i;
					twitter.lastId = item.id;
					
				}else if( socialType == "instagram"){
					instagram.lastIndex = i;
					instagram.lastId = item.id;
					
				}
			}
		});
		
		
		
	};
	
	var getAvailableSocialIndex = function(){
		var socialIndexes = [];
		if(fb.isAvailable){
			socialIndexes.push(fb.lastIndex);
		}
		
		if(instagram.isAvailable){
			socialIndexes.push(instagram.lastIndex);
		}
		
		if(twitter.isAvailable){
			socialIndexes.push(twitter.lastIndex);
		}
		
		return socialIndexes;
	};

	var processFeed = function(callback){
		var activeIndex = 0,
			activeSocialTitle,
			activeSocial,
			availableSocialIndexes;
		
		sortFeed();
		setIndexes("fb");
		setIndexes("twitter");
		setIndexes("instagram");

		availableSocialIndexes = getAvailableSocialIndex();
		
		if(Math.min.apply({}, availableSocialIndexes) >= PAGE_SIZE){
			callback();
			return;
		}
		
		//fb.isAvailable = false;
		twitter.isAvailable = false;
		
		// if the API breaks.
		if(fb.isAvailable){
		
			activeSocial = fb;
		
		}else if(twitter.isAvailable){
			
			activeSocial = twitter;
			
		}else if(instagram.isAvailable){
			
			activeSocial = instagram;
		}
		
		
		
		activeIndex = activeSocial.lastIndex;
		activeSocialTitle = activeSocial.TITLE;
	
			
		if(fb.isAvailable && fb.lastIndex < activeIndex){
			
			activeIndex = fb.lastIndex;
			activeSocialTitle = fb.TITLE;
			
		}
		
		
		if(twitter.isAvailable && twitter.lastIndex < activeIndex){
			
			activeIndex = twitter.lastIndex;
			activeSocialTitle = twitter.TITLE;
			
		}
		
		if(instagram.isAvailable && instagram.lastIndex < activeIndex){
		
			activeIndex = instagram.lastIndex;
			activeSocialTitle = instagram.TITLE;
			
		}
		
		switch(activeSocialTitle){
			case "FB":
				Q(fb.getPromise()).then(function(){
					processFeed( callback );
				});
				break;
			case "INSTAGRAM":
				Q(instagram.getPromise()).then(function(){
					processFeed( callback );
				});
				
				break;
			case "TWITTER":
				
				Q(twitter.getPromise()).then(function(){
					processFeed( callback );
				});
				
				break;
		}
	};
	
	var sortFeed = function(){
		if(feeds.length){
			feeds = feeds.sort(function(itemA, itemB){
				return itemB.created_time - itemA.created_time;
			});
		}
	};
	
	
	return {
		getTimeline: function(req, callback, scope){
			feeds = [];
			var promises = [],
				returnResponse = function(){
					feeds = feeds.slice(0, PAGE_SIZE);
					setIndexes("fb");
					setIndexes("twitter");
					setIndexes("instagram");
					callback.call(scope, {
						lastIndex: {
							fb:			fb.lastIndex,
							instagram:	instagram.lastIndex,
							twitter:	twitter.lastIndex
						},
						lastId: {
							fb:			fb.lastTimestamp,
							instagram:	instagram.lastId,
							twitter:	twitter.lastId
						},
						feedCount: feeds.length,
						feeds: feeds
					});
				};
			
			promises.push( fb.getPromise() );
			promises.push( twitter.getPromise() );
			promises.push( instagram.getPromise() );
			
			
			Q.all(promises).then(function(){
				processFeed(returnResponse);
		
			}).fail(function(error){
				
				console.log(error);
				processFeed(returnResponse);
				
			});
		}
		
	};
	
};


module.exports = {
	getTimeline: function(req, callback, scope){
		var t = timeline();
		t.getTimeline(req, callback, scope);
	}
};
