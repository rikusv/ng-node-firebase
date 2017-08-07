var Message = require('./message.js');

// Get firebase admin client
var firebase = require('./database.js');

// Get elasticsearch client
var elastic = require('./search-engine.js');

// Get Google Maps functions
var maps = require('./maps.js');

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
      maps.geocode(req.body.address)
        .then(function(result) {
          req.body.address_full = result.formatted_address;
          req.body.address_coordinates = result.location;
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
        })
        .catch(function(err) {
          console.log(err);
        });

    } catch (e) {
      console.log(e);
      res.status(500);
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
      if (!req.query.$search) {
        next(new Message("At least '$search' parameter is required, e.g. customers?$search=something"));
      }
      var query = req.query.$search.toLowerCase();
      var $prefixArray = [];
      if (req.query.$prefix !== 'none') { // prefix on no fields if 'none'
        $prefixArray = req.query.$prefix ? // prefix on provided fields
          req.query.$prefix.split(',') : ['idNumber', 'firstName', 'lastName', 'email']; // default prefix fields
      }
      $prefixArray = $prefixArray.map(function(p) {
        var prefix = {};
        prefix[p] = query;
        return {
          "prefix": prefix
        };
      });
      var $matchArray = [];
      if (req.query.$match !== 'none') { // match on no fields if 'none'
        $matchArray = req.query.$match ? // match on provided fields
          req.query.$match.split(',') : ['address', 'address_full']; // default match fields
      }
      $matchArray = $matchArray.map(function(m) {
        var match = {};
        match[m] = query;
        return {
          "match": match
        };
      });
      var array = [];
      array = $prefixArray.concat($matchArray);
      elastic.search({
        index: 'firebase',
        type: 'customers',
        body: {
          query: {
            bool: {
              should: array
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
        res.json({
          data: array
        });
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
