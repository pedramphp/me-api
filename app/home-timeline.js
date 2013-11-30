var facebookApi =  require("./facebookApi"),
	instagramApi =  require("./instagramApi"),
	twitterApi =  require("./twitterApi");
	moment = require("moment");

var timeline =  function(){
	
	return {
		getTimeline: function(req, callback, scope){
			var instagramAccessToken = "353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b";
			var facebookAccessToken = "CAADuCyYQHbwBAPSLZC1tebwdgiUqBHMTVKXx2QEM7rLuFSrrCilNydkeDZAG8rZAK1NIFLZAFMkOtI4xFydd3S1XpmGJ5SE3PqMt7PKd4lSBSnk0kgZBXSgbi0gZCa7seZCku3kBdX2jCv3iZAOH1iyIM1fxGTHFZBF6uPEDtPYGDlZBxXJaZCN1VUeMPgoEjerDj4ZD";
			var limit = 3;
			var start = 0;
			 
			var feeds = [], 
				fbStatus = false, 
				instagramStatus = false;
			
			var returnResponse = function(){
				if(fbStatus && instagramStatus && twitterStatus){
					feeds = feeds.sort(function(itemA, itemB){
						console.log(itemB.created_time - itemB.created_time);
						return itemB.created_time - itemA.created_time;
					});
					callback.call(scope, feeds);
				}
			};
			
			facebookApi.getUserFeed({ start: start, limit: limit, accessToken: facebookAccessToken}, function(items){
				console.log(arguments);
				if( items.error){
					fbStatus = true;
					returnResponse();
					return;
				}
				items.data.forEach(function(item) {
					var date = new Date(item.created_time);
					feeds.push({
						created_time: date.valueOf(),
						type: "fb",
					//	item: item,
						created_time_string: moment(date.valueOf()).format('MMMM Do YYYY, h:mm:ss a')
					});
				});
				fbStatus = true;
				returnResponse();
			}, this);
			
			
			
			instagramApi.getUserFeed(instagramAccessToken, function(items){
			//	console.log(typeof items.data);
				if( items.error){
					instagramStatus = true;
					returnResponse();
					return;
				}
				items.data.forEach(function(item) {
					feeds.push({
						created_time: item.created_time * 1000,
						type: "instagram",
					//	item: item,
						id: item.id,
						created_time_string: moment(item.created_time * 1000).format('MMMM Do YYYY, h:mm:ss a')
				
					});
				});
				instagramStatus = true;
				returnResponse();
				
			}, this);
			
			
			twitterApi.getUserFeed(null, function(items){
			//	console.log(typeof items.data);
				if( items.error){
					twitterStatus = true;
					returnResponse();
					return;
				}
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
				twitterStatus = true;
				returnResponse();
				
			}, this);
		
			
		
		},
		
	};
	
}();


module.exports = timeline;