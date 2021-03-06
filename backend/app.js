// Set up Express
var express = require('express'),
  app = express();

var Message = require('./message.js');

// Get parser for JSON requests
var bodyParser = require('body-parser'),
  jsonParser = bodyParser.json();

// Get firebase admin client
var firebase = require('./database.js');

// Get elasticsearch client
var elastic = require('./search-engine.js');

// Get customer functions
var customers = require('./customers.js');

// Get Google Maps functions
var maps = require('./maps.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN");
  next();
});

app.route('/api/*')
  .post(checkAuth, jsonParser, checkJSON);

app.route('/api/v1/_utils/autocomplete/address')
  .get(function(req, res, next) {
    if (req.query.input) {
      // maps.autoComplete(req, res, next);
      maps.autoComplete(req.query.input).then(function(result) {
        res.json({
          data: result
        });
      }).catch(function(error) {
        console.log(error);
        next(new Message('Auto Complete error', error));
      });
    } else {
      next(new Message('Query not recognized. Use /api/utils/autocomplete?input=something'));
    }
  });

app.route('/api/v1/customers')
  .post(customers.checkNewCustomer, customers.postNewCustomer)
  .get(function(req, res, next) {
    customers.searchCustomers(req, res, next);
  });

app.route('/api/*')
  .get(function(req, res, next) {
    res.status(404);
    next(new Message('Endpoint not found', {
      'options': [
        'Post new customer record to /api/v1/customers',
        'Search for customers using /api/v1/customers?$search=something'
      ]
    }));
  });

app.use(handleError);

function handleError(err, req, res, next) {
  try {
    if (res.headersSent) {
      return next(err);
    }
    if (!res.status) {
      res.status(500);
    }
    res.json(err);
  } catch (e) {
    console.log(e);
    next(new Message('Something went wrong while trying to handle an error...'));
  }
}

function checkAuth(req, res, next) {
  try {
    var token = req.get('Authorization');
    firebase.admin.auth().verifyIdToken(token)
      .then(function(decodedToken) {
        res.locals.user = decodedToken.uid;
        next();
      }).catch(function(error) {
        res.status(401);
        next(new Message('Could not authenticate user', error));
      });
  } catch (e) {
    console.log(e);
    next(new Message('Something went wrong while trying to authenticate user', e));
  }
}

function checkJSON(req, res, next) {
  try {
    if (!req.body) {
      res.status(400);
      next(new Message('Request body does not seem to be JSON'));
    }
    next();
  } catch (e) {
    console.log(e);
    next(new Message('Something went wrong during JSON validation'));
  }

}

module.exports = app;
