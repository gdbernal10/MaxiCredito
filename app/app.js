/*global angular*/
(function(){
   'use strict';
   
   var app = angular.module('maxicreditoApp', ['ngResource', 'maxicreditoControllers']);
   
   app.constant('myConfig', {
      endPoint: 'http://ec2-52-23-194-180.compute-1.amazonaws.com'
   });
//   app.config(function($httpProvider){
//         $httpProvider.defaults.useXDomain = true;
//         $httpProvider.defaults.headers.common = 'Content-Type: application/json';
//         delete $httpProvider.defaults.headers.common['X-Requested-With']; 
//   });
   
}())