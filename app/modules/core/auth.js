"use strict";

var Q = require('q');

var auth = function(logger){
	
	return {
		facebook: function(){
			
			var deferred = Q.defer();
			
			setTimeout(function(){
				deferred.resolve("HI");
			}, 3000);

			return deferred.promise;
		}
		
	}
}( require("app/helpers/common").logger );

module.exports = auth;