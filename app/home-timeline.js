var facebookApi =  require("./facebookApi"),
	instagramApi =  require("./instagramApi"),
	twitterApi =  require("./twitterApi");
	moment = require("moment"),
	Q = require('q');

var timeline =  function(){
	var feeds = [];
		
		
	var fb = {
		config: {
			accessToken: "CAADuCyYQHbwBAHzhspZBlSznNcFnhDXMnmejoVvx82yeKHWirWORkq5VlddWVutORYZAO17ZBLIA9JbX7rt2lgSygCnkRH3RKzq1WZBJC8nSZCmCPJZA8hqTofwy5g20Q0YyaQqsENS8yBgqGpgbgfClhgZCSBi9vt8BBQrycTQcbrFfzmi5dXveolVWbHtTzthw8a4I3thIAZDZD",
			limit: 3,
			before: 0			
		},
		
		setSize: function(size){
			this.config.limit = size;
		},
		
		getPromise: function(){
			return facebookApi.getFeedPromise(this.config)
									.then(this.feedCallback)
									.fail(function(error){
										console.log("FB Error", error);
									});
		},
		
		feedCallback: function(items){
			items.data.forEach(function(item) {
				var date = new Date(item.created_time);
				feeds.push({
					created_time: date.valueOf(),
					type: "fb",
				//	item: item,
					created_time_string: moment(date.valueOf()).format('MMMM Do YYYY, h:mm:ss a')
				});
			});				
		}
	};
	
	var twitter = {
			config: {
				accessToken: "CAADuCyYQHbwBAHzhspZBlSznNcFnhDXMnmejoVvx82yeKHWirWORkq5VlddWVutORYZAO17ZBLIA9JbX7rt2lgSygCnkRH3RKzq1WZBJC8nSZCmCPJZA8hqTofwy5g20Q0YyaQqsENS8yBgqGpgbgfClhgZCSBi9vt8BBQrycTQcbrFfzmi5dXveolVWbHtTzthw8a4I3thIAZDZD",
				limit: 3		
			},
			
			setSize: function(size){
				this.config.limit = size;
			},
			
			getPromise: function(){
				return twitterApi.getFeedPromise(this.config)
									.then(this.feedCallback)
									.fail(function( error ){ 
										console.log(error); 
									});
			},
			
			feedCallback: function(items){
				items.forEach(function(item) {
					var date = new Date(item.created_at);
					feeds.push({
						created_time: date.valueOf(),
						type: "twitter",
					//	item: item,
						id: item.id,
						created_time_string: moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')
				
					});
				});
			}
	};
	
	var instagram = {
		config: {
			accessToken: "353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b",
			limit: 3			
		},
		
		setSize: function(size){
			this.config.limit = size;
		},
		
		getPromise: function(){
			return instagramApi.getFeedPromise(this.config)
									.then(this.feedCallback)
									.fail(function( error ){ 
										console.log(error); 
									});
		},
		
		feedCallback: function(items){
			items.data.forEach(function(item) {
				feeds.push({
					created_time: item.created_time * 1000,
					type: "instagram",
				//	item: item,
					id: item.id,
					created_time_string: moment(item.created_time * 1000).format('MMMM Do YYYY, h:mm:ss a')
			
				});
			});			
		}
	};
	
	return {
		getTimeline: function(req, callback, scope){
			
			var promises = [],
				returnResponse = function(){
					if(feeds.length){
						feeds = feeds.sort(function(itemA, itemB){
							return itemB.created_time - itemA.created_time;
						});
					}
					callback.call(scope, feeds);
				};
			
			promises.push( fb.getPromise() );
			promises.push( twitter.getPromise() );
			promises.push( instagram.getPromise() );
			
			
			Q.all(promises).then(function(){
				
				returnResponse();
		
			}).fail(function(error){
				console.log(error);
				returnResponse();
			})
		}
		
	};
	
}();


module.exports = timeline;