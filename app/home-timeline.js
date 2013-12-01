var facebookApi =  require("./facebookApi"),
	instagramApi =  require("./instagramApi"),
	twitterApi =  require("./twitterApi");
	moment = require("moment"),
	Q = require('q');

var timeline =  function(){
	var feeds = [];
		
		
	var fb = {
		TITLE: "FB",
		lastIndex: 0,
		count: 0,
		lastTimestamp: null,
		config: {
			accessToken: "CAADuCyYQHbwBAJyU66oaEIwMwMdcF7c0SPKRopTq60hqVSDZB4X8wqS5C06KdzejEx2tPOSAjDDvvETz5U5RKw8dp25hYIkvCppku1JBKgTwPqqfqSZBWLEMUeDbZAHQ31jxq28cYc7IR3DrPBrlc3ZCzc5aOPHGaAAyzzZA9WVAdG4Q9nl7ZBUQPhbU4vlfgZCc5ckxm36kAZDZD",
			limit: 3,
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
										console.log("FB Error", error);
									});
		},
		
		feedCallback: function(items){
			this.lastTimestamp = null;
			console.log(" WPW ", items.data.length);
			items.data.forEach(function(item) {
				var date = new Date(item.created_time);
				feeds.push({
					created_time: date.valueOf(),
					type: "fb",
					//item: item,
					created_time_string: moment(date.valueOf()).format('MMMM Do YYYY, h:mm:ss a')
				});
			});	
			this.count = items.data.length || 0;			
		}
	};
	
	var twitter = {
			TITLE: "TWITTER",
			count: 0,
			lastIndex: 0,
			lastId: null,
			config: {
				accessToken: "CAADuCyYQHbwBAHzhspZBlSznNcFnhDXMnmejoVvx82yeKHWirWORkq5VlddWVutORYZAO17ZBLIA9JbX7rt2lgSygCnkRH3RKzq1WZBJC8nSZCmCPJZA8hqTofwy5g20Q0YyaQqsENS8yBgqGpgbgfClhgZCSBi9vt8BBQrycTQcbrFfzmi5dXveolVWbHtTzthw8a4I3thIAZDZD",
				limit: 3		
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
									});
			},
			
			feedCallback: function(items){
				this.lastId = null;
				items.forEach(function(item) {
					var date = new Date(item.created_at);
					feeds.push({
						created_time: date.valueOf(),
						type: "twitter",
						//item: item,
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
									});
		},
		
		feedCallback: function(items){
			this.lastId = null;
			items.data.forEach(function(item) {
				feeds.push({
					created_time: item.created_time * 1000,
					type: "instagram",
					//item: item,
					id: item.id,
					created_time_string: moment(item.created_time * 1000).format('MMMM Do YYYY, h:mm:ss a')
				});
			});			
			
			
			this.count = items.data.length || 0;
		}
	};
	
	var setIndexes = function(socialType){
		var i = 0;
		feeds.forEach(function(item) {
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
			i++;
		});
	};
	
	var processFeed = function(callback){
		var activeIndex = 0,
			activeSocial;
		
		sortFeed();
		setIndexes("fb");
		setIndexes("twitter");
		setIndexes("instagram");
		if(Math.min(fb.lastIndex, instagram.lastIndex, twitter.lastIndex) >= 10){
			callback();
			return;
		}
		
		activeIndex = fb.lastIndex;
		activeSocial = fb.TITLE;
		
		if(twitter.lastIndex < activeIndex){
			
			activeIndex = twitter.lastIndex;
			activeSocial = twitter.TITLE;
			
		}
		
		if(instagram.lastIndex < activeIndex){
			
			activeIndex = instagram.lastIndex;
			activeSocial = instagram.TITLE;
			
		}
		
		
		switch(activeSocial){
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
		
		//ready to print response
		//
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
			
			var promises = [],
				returnResponse = function(){
					feeds = feeds.slice(0, 10);
							setIndexes("fb");
		setIndexes("twitter");
		setIndexes("instagram");
					callback.call(scope, {
						lastIndex: {
							fb: 		fb.lastIndex, 
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
	
}();


module.exports = timeline;