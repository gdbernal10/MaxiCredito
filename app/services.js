(function(){
    'use strict';
    
    var services = angular.module('maxicreditoServices', []);
    
    services.factory('Products', ['$resource', function($resource){
		return $resource('http://ec2-52-23-194-180.compute-1.amazonaws.com/rates');
		//return $resource('data/credits.js');
	}]);
	
	services.factory('need', [function(){
	    return {};
	}]);
}())