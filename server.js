// Only used for serving front- and back-end together

// Write environment variables if not exist
require('dotenv').config();

// Get Express
var express = require('express');
var app = require('./backend/app.js');

// Serve Angular app
app.use(express.static('frontend/dist'));
app.all("/*", function(req, res, next) {
  res.sendFile("index.html", {
    root: __dirname + "/frontend/dist"
  });
});

// Start elasticsearch indexing
require('./backend/search-index.js');

// Serve Express app
app.listen(process.env.PORT, function() {
  console.log('Listening on port ' + process.env.PORT);
});
