'use strict';

const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    json = require('body-parser').json(),
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

    app.use(json);
    app.use(this.loadFixtures);
    app.use('/app', express.static('client'));

    this.addRestEndpoints();

    io.on('connection', function(socket) {
      console.log('A new user connected!');
    });

    http.listen(settings.port, function() {
      console.log(`Listening on *:${ settings.port }`);
    });
  },

  addRestEndpoints() {
    // Publishing
    app.get('/publishing', function(request, response) {
      response.json(request.session.publishing);
    });

    app.get('/publishing/:id', function(request, response) {
      let publishing = request.session.publishing.find((element) => {
        return element.id === request.params.id;
      });

      if(publishing) {
        response.json(publishing);
      } else {
        response.status(404).send('Not found');
      }
    });

    app.post('/publishing', function(request, response) {
      request.session.publishing.push(request.body);
      io.emit('publishing.update');

      response.status(200).send('OK');
    });

    app.put('/publishing/:id', function(request, response) {
      let index = request.session.publishing.findIndex((element) => {
        return element.id === request.params.id;
      });

      if(index === -1) {
        response.status(404).send('Not found');
      } else {
        request.session.publishing[index] = request.body;
        io.emit('publishing.update');

        response.status(200).send('OK');
      }
    });

    app.delete('/publishing/:id', function(request, response) {
      let index = request.session.publishing.findIndex((element) => {
        return element.id === request.params.id;
      });

      if(index === -1) {
        response.status(404).send('Not found');
      } else {
        request.session.publishing.splice(index, 1);

        response.status(200).send('OK');
      }
    });

    // Reach
    app.get('/reach', function(request, response) {
      response.json(request.session.reach);
    });

    app.get('/reach/:index', function(request, response) {
      let reach = request.session.reach[request.params.index];

      if(reach) {
        response.json(reach);
      } else {
        response.status(404).send('Not found');
      }
    });

    app.post('/reach', function(request, response) {
      request.session.reach.push(request.body);
      io.emit('reach.update');

      response.status(200).send('OK');
    });

    app.put('/reach/:index', function(request, response) {
      if(request.session.reach[request.params.index]) {
        request.session.reach[request.params.index] = request.body;
        io.emit('reach.update');

        response.status(200).send('OK');
      } else {
        response.status(404).send('Not found');
      }
    });

    app.delete('/reach/:index', function(request, response) {
      if(request.session.reach[request.params.index]) {
        request.session.reach.splice(request.params.index, 1);

        response.status(200).send('OK');
      } else {
        response.status(404).send('Not found');
      }
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
