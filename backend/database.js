// Write environment variables if not exist
require('dotenv').config();

// Get firebase admin library
var admin = require('firebase-admin');

// Check environment variables
var assert = require('assert');
assert.ok(
  process.env.FIREBASE_URL,
  'Missing environmental variable FIREBASE_URL.'
);
assert.ok(
  process.env.FIREBASE_URL.match(/https:\/\/.*firebaseio.com$/),
  'FIREBASE_URL looks wrong.'
);
assert.ok(
  process.env.FIREBASE_KEY,
  'Missing environmental variable FIREBASE_KEY.'
);
assert.ok(
  process.env.FIREBASE_KEY.match(/^{.*service_account.*private_key_id.*}$/),
  'FIREBASE_KEY looks wrong.'
);

// Initialize firebase admin client
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: process.env.FIREBASE_URL
});

console.log('Database client seems to be working');

db = admin.database();

module.exports = {
  admin: admin,
  db: db
};
