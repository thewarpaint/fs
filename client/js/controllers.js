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
    post_impressions: {
      value: 0,
      date: getDefaultDate(),
      time: getDefaultDateForTime()
    },
    post_impressions_organic: {
      value: 0,
      date: getDefaultDate(),
      time: getDefaultDateForTime()
    },
    post_impressions_viral: {
      value: 0,
      date: getDefaultDate(),
      time: getDefaultDateForTime()
    },
    post_impressions_paid: {
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
    twoPad(data.date.getDate()) + 'T' + twoPad(data.time.getHours()) + ':' +
    twoPad(data.time.getMinutes()) + ':' + twoPad(data.time.getSeconds()) + '.000Z';
}

function getAPIModelFromJSModel(data) {
  var model = {};

  Object.keys(data).forEach(function (key) {
    model[key] = [{
      value: data[key].value,
      timestamp: getTimestampStringFromJSModel(data[key])
    }];
  });

  return model;
}

angular
  .module('falconSocialApp')
  .controller('ReachListController', ['ReachResource', function (ReachResource) {
    this.init = function () {
      this.list = [];

      ReachResource.query().$promise.then(function (list) {
        this.list = list;
      }.bind(this), function () {
        this.message = 'Error retrieving the Reach list';
      }.bind(this));
    };

    this.init();
  }])
  .controller('ReachNewController', ['ReachResource', function (ReachResource) {
    this.init = function () {
      this.newItem = getNewItem();
      this.message = '';
    };

    this.copyDateAndTime = function (item) {
      var keys = ['post_impressions_organic', 'post_impressions_viral', 'post_impressions_paid'];

      keys.forEach(function (key) {
        item[key].date = cloneDate(item.post_impressions.date);
        item[key].time = cloneDate(item.post_impressions.time);
      });
    };

    this.onSubmit = function () {
      this.message = '';

      ReachResource.save(getAPIModelFromJSModel(this.newItem)).$promise.then(function () {
        this.newItem = getNewItem();
        this.message = 'New Reach item was created successfully!';
      }.bind(this), function () {
        this.message = 'Error creating a new Reach item';
      }.bind(this));
    };

    this.init();
  }])
  .controller('PublishingListController', ['PublishingResource', function (PublishingResource) {
    this.init = function () {
      this.list = [];

      PublishingResource.query().$promise.then(function (list) {
        this.list = list;
      }.bind(this), function () {
        this.message = 'Error retrieving the Reach list';
      }.bind(this));
    };

    this.init();
  }]);
