// Only used for standalone mode

// Write environment variables if not exist
require('dotenv').config();


// Start elasticsearch indexing
require('./search-index.js');

// Serve Express app
var app = require('./app.js');
app.listen(process.env.PORT, function() {
  console.log('Listening on port ' + process.env.PORT);
});
