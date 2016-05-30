'use strict';

function getDefaultDate() {
  return new Date();
}

function getDefaultDateForTime() {
  return new Date(1970, 0, 1, 12, 0, 0);
}

function cloneDate(date) {
  return new Date(date.getTime());
}

function getNewItem() {
  return {
    postImpressions: {
      value: 0,
      date: getDefaultDate(),
      time: getDefaultDateForTime()
    },
    postImpressionsOrganic: {
      value: 0,
      date: getDefaultDate(),
      time: getDefaultDateForTime()
    },
    postImpressionsViral: {
      value: 0,
      date: getDefaultDate(),
      time: getDefaultDateForTime()
    },
    postImpressionsPaid: {
      value: 0,
      date: getDefaultDate(),
      time: getDefaultDateForTime()
    }
  };
}

function twoPad(number) {
  return number > 9 ? number : '0' + number;
}

function getTimestampStringFromJSModel(data) {
  return data.date.getFullYear() + '-' + twoPad(data.date.getMonth() + 1) + '-' +
    twoPad(data.date.getDate()) + 'T' + twoPad(data.time.getHours()) + ':' + twoPad(data.time.getMinutes()) +
    ':' + twoPad(data.time.getSeconds()) + '.000Z';
}

function getAPIModelFromJSModel(data) {
  var model = {};

  Object.keys(data).forEach(function (key) {
    model[key] = {
      value: data[key].value,
      timestamp: getTimestampStringFromJSModel(data[key])
    };
  });

  return model;
}

angular
  .module('falconSocialApp')
  .controller('ReachNewController', ['ReachResource', function (ReachResource) {
    this.newItem = getNewItem();
    this.message = '';

    this.copyDateAndTime = function (item) {
      var keys = ['postImpressionsOrganic', 'postImpressionsViral', 'postImpressionsPaid'];

      keys.forEach(function (key) {
        item[key].date = cloneDate(item.postImpressions.date);
        item[key].time = cloneDate(item.postImpressions.time);
      });
    };

    this.onSubmit = function () {
      this.message = '';

      ReachResource.save(getAPIModelFromJSModel(this.newItem)).$promise.then(function () {
        this.newItem = getNewItem();
        this.message = 'New Reach item was created successfully!';
      }.bind(this), function () {
        this.message = 'Error creating a new Reach item';
      });
    };
  }]);
