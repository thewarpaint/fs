'use strict';

const app = require('express')(),
    http = require('http').Server(app),
    session = require('express-session'),
    settings = require('./settings.json'),
    fixtures = {
      publishing: require('./fixtures/publishing.json'),
      reach: require('./fixtures/reach.json')
    };

let Server = {
  init() {
    // Use express-session to hold the publishing and reach data in memory
    app.use(session({
      cookie: { secure: false },
      genid: function() {
        return 'socialfalcon';
      },
      resave: false,
      saveUninitialized: true,
      secret: 'socialfalcon'
    }));

    app.use(this.loadFixtures);

    this.addRestEndpoints();

    http.listen(settings.port, function() {
      console.log(`Listening on *:${ settings.port }`);
    });
  },

  addRestEndpoints() {
    app.get('/publishing', function(request, response) {
      response.json(request.session.publishing);
    });

    app.get('/reach', function(request, response) {
      response.json(request.session.reach);
    });
  },

  loadFixtures(request, response, next) {
    if(!request.session.publishing) {
      request.session.publishing = fixtures.publishing;
    }

    if(!request.session.reach) {
      request.session.reach = fixtures.reach;
    }

    next();
  }
};

Server.init();
