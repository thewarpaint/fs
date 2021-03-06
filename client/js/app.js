'use strict';

angular
  .module('falconSocialApp', ['ngResource', 'ngRoute'])
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $routeProvider
        .when('/publishing', {
          templateUrl: 'views/publishing-list.html',
          controller: 'PublishingListController',
          controllerAs: 'publishing'
        })
        .when('/publishing/new', {
          templateUrl: 'views/publishing-new.html',
          controller: 'PublishingNewController',
          controllerAs: 'publishing'
        })
        .when('/publishing/:id', {
          templateUrl: 'views/publishing-new.html',
          controller: 'PublishingNewController',
          controllerAs: 'publishing'
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
        .when('/reach/graph', {
          templateUrl: 'views/reach-graph.html',
          controller: 'ReachGraphController',
          controllerAs: 'reach'
        })
        .otherwise('/reach');
    }
  ]);
