// Adapted from http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
'use strict';

angular
  .module('falconSocialApp')
  .factory('Socket', function ($rootScope) {
    var socket = io('http://localhost:3000/');

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;

          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;

          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
