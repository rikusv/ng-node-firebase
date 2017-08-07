// Write environment variables if not exist
require('dotenv').config();

// Check the environment variable
var assert = require('assert');
assert.ok(
  process.env.GOOGLE_KEY,
  'Missing environmental variable GOOGLE_KEY.'
);

var client = require('@google/maps').createClient({
  key: process.env.GOOGLE_KEY
});

module.exports = {

  autoComplete: function(input) {
    return new Promise(function(resolve, reject) {
      try {
        client.placesAutoComplete({
          input: input,
          language: 'en',
          components: {
            country: 'za'
          }
        }, function(err, response) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            var results = [];
            response.json.predictions.map(function(result) {
              results.push({short: result.description});
            });
            resolve(results);
          }
        });
      } catch (e) {
        console.log(e);
        next(new Message('Something went wrong while trying to get autocomplete results'));
      }
    });
  },

  // E.g.:
  // autoComplete('8 main').then(function(result) {
  //   console.log(result);
  // }).catch(function(err) {
  //   console.log(err);
  // });

  geocode: function(address) {
    return new Promise(function(resolve, reject) {
      try {
        client.geocode({
          address: address,
          language: 'en',
          components: {
            country: 'za'
          }
        }, function(err, response) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            // console.log(response.json.results[0].formatted_address);
            // console.log(response.json.results[0].geometry.location);
            // var results = [];
            // response.json.predictions.map(function(result) {
            //   results.push(result.description);
            // });
            resolve({
              formatted_address: response.json.results[0].formatted_address,
              location: response.json.results[0].geometry.location
            });
          }
        });
      } catch (e) {
        console.log(e);
        next(new Message('Something went wrong while trying to geocode address'));
      }
    });
  }
  //
  // geocode('8 Archie Gwillam Crescent, Durban South, South Africa').then(function(result) {
  //   console.log(result);
  // }).catch(function(err) {
  //   console.log(err);
  // });
};
