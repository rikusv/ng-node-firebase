var Message = require('./message.js');

// Get firebase admin client
var firebase = require('./database.js');

// Get elasticsearch client
var elastic = require('./search-engine.js');

module.exports = {

  checkNewCustomer: function(req, res, next) {
    try {
      var required = ['idNumber', 'firstName', 'lastName', 'email', 'phone', 'address'],
        missing = required.filter(function(property) {
          return !req.body[property];
        });
      if (missing.length) {
        res.status(422);
        next(new Message('New customer validation failed', 'Required fields missing: ' + missing.join(', ')));
      } else {
        next();
      }
    } catch (e) {
      console.log(e);
      next(new Message('Something went wrong while checking new customer'));
    }
  },

  postNewCustomer: function(req, res, next) {
    try {
      var customersRef = firebase.db.ref('/customers');
      var newCustomerRef = customersRef.push();
      newCustomerRef.set(req.body)
        .then(function() {
          res.status(201)
            .json(new Message('New customer record created', req.body, 'info'));
        })
        .catch(function(error) {
          res.status(500);
          next(new Message('Could not save new customer', error));
        });
    } catch (e) {
      console.log(e);
      next(new Message('Something went wrong while posting new customer'));
    }
  },

  // getCustomers: function(req, res) {
  //   var customersRef = firebase.db.ref('/customers');
  //   customersRef.once('value')
  //     .then(function(snapshot) {
  //       // res.status(200).json(snapshot.val());
  //       res.json(querystring.parse);
  //     });
  // },

  searchCustomers: function(req, res, next) {
    try {
      var query = req.query.$prefix.toLowerCase();
      elastic.search({
        index: 'firebase',
        type: 'customers',
        body: {
          query: {
          bool: {
            should: [
              {prefix: {idNumber: query}},
              {prefix: {firstName: query}},
              {prefix: {lastName: query}},
              {prefix: {email: query}}
            ]
          }
        }
        }
      }).then(function(body) {
        var array = body.hits.hits.map(function(o) {
          return {
            id: o._id,
            firstName: o._source.firstName,
            lastName: o._source.lastName,
            idNumber: o._source.idNumber,
            email: o._source.email,
            phone: o._source.phone,
            address: o._source.address
          };
        });
        res.json({data: array});
      }, function(error) {
        console.log(error.message);
        next(new Message('Search error', error));
      });
    } catch (e) {
      console.log(e);
      next(new Message('Something went wrong while searching customers'));
    }
  }

};
