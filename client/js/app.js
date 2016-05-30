'use strict';

angular
  .module('falconSocialApp', ['ngResource', 'ngRoute'])
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html'
        })
        .when('/reach/new', {
          templateUrl: 'views/reach-new.html',
          controller: 'ReachNewController',
          controllerAs: 'reach'
        })
        .otherwise('/');
    }
  ]);
