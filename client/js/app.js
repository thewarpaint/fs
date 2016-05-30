'use strict';

angular
  .module('falconSocialApp', ['ngResource', 'ngRoute'])
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html'
        })
        .when('/reach', {
          templateUrl: 'views/reach-list.html',
          controller: 'ReachListController',
          controllerAs: 'reach'
        })
        .when('/reach/new', {
          templateUrl: 'views/reach-new.html',
          controller: 'ReachNewController',
          controllerAs: 'reach'
        })
        .otherwise('/');
    }
  ]);
