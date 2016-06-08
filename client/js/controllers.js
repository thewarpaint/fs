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

function getNewReachItem() {
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

function getNewPublishingItem() {
  return {
    content: {
      media: {
        fileName: '',
        url: ''
      },
      message: '',
      network: null,
      postType: null,
    },
    geo: {
      cities: [{}],
      countries: [{}],
      languages: [{}],
      regions: [{}]
    },
    id: null,
    scheduled: null,
    status: null,
    tags: ''
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
      this.newItem = getNewReachItem();
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
        this.newItem = getNewReachItem();
        this.message = 'New Reach item was created successfully!';
      }.bind(this), function () {
        this.message = 'Error creating a new Reach item';
      }.bind(this));
    };

    this.init();
  }])
  .controller('ReachGraphController', ['ReachResource', 'Socket', function (ReachResource, Socket) {
    this.init = function () {
      this.list = [];
      this.update();

      Socket.on('reach.update', function () {
        this.update();
      }.bind(this));
    };

    this.update = function () {
      ReachResource.query().$promise.then(function (list) {
        this.list = list;
      }.bind(this), function () {
        this.message = 'Error retrieving the Reach list';
      }.bind(this));
    };

    this.init();
  }])
  .controller('PublishingListController', ['PublishingResource', 'Socket',
      function (PublishingResource, Socket) {
    this.init = function () {
      this.list = [];
      this.update();

      Socket.on('publishing.update', function () {
        this.update();
      }.bind(this));
    };

    this.update = function () {
      PublishingResource.query().$promise.then(function (list) {
        this.list = list;
      }.bind(this), function () {
        this.message = 'Error retrieving the Publishing list';
      }.bind(this));
    };

    this.delete = function (item) {
      PublishingResource.delete({ id: item.id }).$promise.then(function () {
        this.message = 'Publishing item was successfully deleted!';
        this.list.splice(this.list.indexOf(item), 1);
      }.bind(this), function () {
        this.message = 'Error deleting the Publishing item';
      }.bind(this));
    }

    this.init();
  }])
  .controller('PublishingNewController', ['PublishingResource', '$routeParams',
      function (PublishingResource, $routeParams) {
    this.statuses = [
      {
        id: 'draft',
        label: 'Draft'
      },
      {
        id: 'scheduled',
        label: 'Scheduled'
      },
      {
        id: 'published',
        label: 'Published'
      }
    ];

    this.postTypes = [
      {
        id: 'photo',
        label: 'Photo'
      },
      {
        id: 'link',
        label: 'Link'
      },
      {
        id: 'text',
        label: 'Text'
      }
    ];

    this.networks = [
      {
        id: 'facebook',
        label: 'Facebook'
      },
      {
        id: 'google+',
        label: 'Google+'
      },
      {
        id: 'twitter',
        label: 'Twitter'
      }
    ];

    this.countries = [
      {
        key: '134',
        value: 'Afghanistan'
      },
      {
        key: '2',
        value: 'Hungary'
      },
      {
        key: '63',
        value: 'Denmark'
      },
      {
        key: '9',
        value: 'Italy'
      }
    ];

    this.languages = [
      {
        key: '31',
        value: 'Afrikaans'
      },
      {
        key: '1',
        value: 'English'
      },
      {
        key: '54',
        value: 'German'
      }
    ];

    this.cities = [
      {
        key: '1',
        value: 'Washington'
      },
      {
        key: '2',
        value: 'Copenhague'
      },
      {
        key: '3',
        value: 'Tokio'
      }
    ];

    this.regions = [
      {
        key: '1',
        value: 'North America'
      },
      {
        key: '2',
        value: 'Europe'
      },
      {
        key: '3',
        value: 'Asia'
      }
    ];

    this.channels = [
      {
        id: 433104606739910,
        name: 'Konfirmanden'
      }
    ];

    this.init = function () {
      this.updateMode = typeof $routeParams.id !== 'undefined';

      if(this.updateMode) {
        this.submitLabel = 'Update';

        PublishingResource.get({ id: $routeParams.id }).$promise.then(function (item) {
          this.item = item;
          this.item.tags = this.item.tags.join(', ');
          this.item.scheduled = new Date(this.item.scheduled);
        }.bind(this), function () {
          this.message = 'Error retrieving the Publishing item with id: ' + $routeParams.id;
        }.bind(this));
      } else {
        this.item = getNewPublishingItem();
        this.submitLabel = 'Create';
      }
    };

    this.addGeoEntry = function (key) {
      this.item.geo[key].push({});
    };

    this.onSubmit = function () {
      var promise;

      this.message = '';

      // Generate tags from a trimmed comma-separated string.
      this.item.tags = this.item.tags.split(/\s*,\s*/).filter(function (tag) {
        return tag.length;
      });

      if(this.updateMode) {
        promise = PublishingResource.update(this.item).$promise;
      } else {
        promise = PublishingResource.save(this.item).$promise;
      }

      promise.then(function () {
        var action;

        if(this.updateMode) {
          action = 'updated';
        } else {
          this.item = getNewPublishingItem();
          action = 'created';
        }

        this.message = 'New Publishing item was ' + action + ' successfully!';
      }.bind(this), function () {
        this.message = 'Error creating a new Publishing item';
      }.bind(this));
    };

    this.init();
  }]);
