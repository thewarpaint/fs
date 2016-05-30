'use strict';

angular
  .module('falconSocialApp')
  .factory('ReachResource', ['$resource', function ($resource) {
    return $resource('/reach/:index', {}, {
      update: { method: 'PUT' }
    });
  }]);
