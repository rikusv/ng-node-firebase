// Get search client
var elastic = require('./search-engine.js'),
  index = 'firebase',
  type = 'customers';

// Get database client
var firebase = require('./database.js');

// Set database ref
var ref = firebase.db.ref("/customers");

// Get data
ref.once('value', initialCreateOrUpdateIndex, handleListenError);
var batchReceived = false; // To ignore child_added before batch received

// Listen for changes at database ref
ref.on('child_added', createOrUpdateIndex, handleListenError);
ref.on('child_changed', createOrUpdateIndex, handleListenError);
ref.on('child_removed', removeIndex, handleListenError);

// Report listening interruptions
function handleListenError(error) {
  console.log('Firebase listening error: ', error);
}

// Batch update
function initialCreateOrUpdateIndex(snapshot) {
  batchReceived = true; // Now start acting on child_added
  console.log('Start batch update');
  try {
    var body = [];
    snapshot.forEach(function(childSnapshot) {
      body.push({
        index: {
          _index: index,
          _type: type,
          _id: childSnapshot.key
        }
      });
      body.push(childSnapshot.val());
    });
    elastic.bulk({
      body: body
    }, function(error, response) {
      if (error) {
        console.log('Could not bulk update index. Error: ' + error);
      } else {
        console.log('Index updated with ' + snapshot.numChildren() + ' records');
      }
    });
  } catch (e) {
    console.log('Something went wrong while trying to batch update elasticsearch index: ' + e);
  }
}


// Amend indexed document
function createOrUpdateIndex(snapshot) {
  if (batchReceived) { // Now action child_added
    console.log('Try to update: ' + snapshot.key);
    try {
      var id = snapshot.key,
        name = snapshot.val().firstName;
      elastic.index({
        index: index,
        type: type,
        id: snapshot.key,
        body: snapshot.val()
      }, function(error, response) {
        if (error) {
          console.log('Could not update index. Error: ' + error);
        } else {
          console.log('Index updated: ' + id + ' (' + name + ')');
        }
      });
    } catch (e) {
      console.log('Something went wrong while trying to update elasticsearch index: ' + e);
    }
  }
}

// Remove indexed document
function removeIndex(snapshot) {
  console.log('Try to remove: ' + snapshot.key);
  try {
    var id = snapshot.key,
      name = snapshot.val().firstName;
    elastic.delete({
      index: 'firebase',
      type: 'customers',
      id: snapshot.key
    }, function(error, response) {
      if (error) {
        console.log('Could not update index. Error: ' + error);
      } else {
        console.log('Index updated: removed ' + id + ' (' + name + ')');
      }
    });
  } catch (e) {
    console.log('Something went wrong while trying to update elasticsearch index: ' + e);
  }

}
