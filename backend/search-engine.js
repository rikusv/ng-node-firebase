// Write environment variables if not exist
require('dotenv').config();

// elasticsearch client library
var elasticsearch = require('elasticsearch');

// Initialize elasticsearch client
var client = new elasticsearch.Client({
  host: process.env.BONSAI_URL
  // log: 'trace'
});

// Check connection
client.ping({
  requestTimeout: 30000,
}, function(error) {
  if (error) {
    console.error('Cannot connect to elasticsearch!');
  } else {
    console.log('elasticsearch connection looks okay');
  }
});

module.exports = client;
