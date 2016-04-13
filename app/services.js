(function(){
    'use strict';
    
    var services = angular.module('maxicreditoServices', []);
    
    services.factory('Products', ['$resource', 'myConfig', function($resource, myConfig){
		return $resource(myConfig.endPoint + '/rates');
		//return $resource('data/credits.js');
	}]);
	
	services.factory('scanners', ['$resource', 'myConfig', function($resource, myConfig){
		return $resource(myConfig.endPoint + '/scanners/:id', {id: '@id'}, {
			delete: { method: 'DELETE'}
		});
	}]);
	
	services.factory('need', [function(){
	    return {};
	}]);
	
	services.factory('subscriptions', ['$resource', 'myConfig', function($resource, myConfig){
		return $resource(myConfig.endPoint + '/scanners/user', {}, {
			search: { method: 'POST', isArray: true }
		});
	}]);
}())