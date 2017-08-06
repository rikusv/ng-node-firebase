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

};
