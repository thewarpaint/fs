'use strict';

angular
  .module('falconSocialApp')
  .factory('ReachResource', ['$resource', function ($resource) {
    return $resource('/reach/:index', {}, {
      update: { method: 'PUT' }
    });
  }])
  .factory('PublishingResource', ['$resource', function ($resource) {
    return $resource('/publishing/:id', {}, {
      update: { method: 'PUT', params: { id: '@id' } }
    });
  }]);
