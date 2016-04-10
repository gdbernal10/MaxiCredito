(function(){
    /*global angular*/
    'use strict';
    
    var controllers = angular.module('maxicreditoControllers', []);
    
    controllers.controller('MainController', ['$scope', function($scope){
        $scope.prueba = 'Sergio Rios';
    }]);
}())