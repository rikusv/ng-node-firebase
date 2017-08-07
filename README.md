# ng-node-firebase

## What is this?

A simple web application for capturing customer information. Try it [here](https://ng-node-firebase.herokuapp.com).

- Sign In: The app requires to user to sign in. Sign-in uses Firebase anonymous authentication, but can be easily switched to Firebase's authentication using Google, Facebook, Email, etc. An authentication token is sent to the backend with all calls and checked on the database.

- Add Customers: First name, last name, South Africa ID number (any 13 digit number), email (any valid email address), phone and address inputs are required. Address autocompletion is provided via the backend using Google Place API limited to South African address. The backend uses Google Maps API to augment the entered address with its formal version (e.g. including postal code) and geographic coordinates and then persists the data to Firebase. The backend also listens to data changes and updates an Elasticsearch index.

- Find Customers: A simple search function is provided using a single input field. The input is used for prefix search on first name, last name, ID number and email, and match search on address and formal address. This means input 'Ge' will match customers with names starting with 'ge' but not with address '1 Main Street, George'; however input 'George' will also match this address.

- Find Customers using the API: more flexible searching is possible using the service directly. For example, [customers?$search=ge&$prefix=lastName](https://ng-node-firebase.herokuapp.com/api/v1/customers?$search=ge&$prefix=lastName) will limit the prefix search to last name, and [customers?$search=george&$prefix=firstName&$match=none](https://ng-node-firebase.herokuapp.com/api/v1/customers?$search=george&$prefix=firstName&$match=none) will limit the prefix search to first name and exclude match results (i.e. town 'George' will not match).

> ### To Do
>
> - Provide customer address map view
> - Improve search by location
> - Add further input validation in back- and frontend.

## How does it work?

An Angular front-end web application accesses a Firebase database via a Node Express.js backend service. The backend service uses Elasticsearch for search customers.

### Backend API service

> Try it:
>
> - Get address suggestions for input '8 main': [ [https://ng-node-firebase.herokuapp.com/api/v1/_utils/autocomplete/address?input=8 main](https://ng-node-firebase.herokuapp.com/api/v1/_utils/autocomplete/address?input=8%20main).
> - Search customers: [https://ng-node-firebase.herokuapp.com/api/v1/customers?$search=ja](https://ng-node-firebase.herokuapp.com/api/v1/customers?$search=ja).
>
> API quick reference:
>
> - $search=something : search for 'something' using standard settings.
> - $search=something&$prefix=firstName,lastName : limit prefix search to first and last name only
> - $search=something&prefix=none : don't use prefix search
> - as above for $match
> - the set of fields are: idNumber, firstName, lastName, email, phone, address, address_full.

The Express.js server:

- Listens to Firebase changes and updates an index on Elasticsearch.
- Responds to requests at `/api`.
- Checks that the user token sent with POST requests corresponds to a valid user in the database (i.e. that user is logged in).
- Queries Elasticsearch and sends JSON result for valid requests like `/api/v1/customers?search=something`.
- Queries Google Places API and sends JSON results for valid requests like `/api/v1/_utils/autocomplete/address?input=8 main`.

### Frontend app

> Try it:
>
> [https://ng-node-firebase.herokuapp.com](https://ng-node-firebase.herokuapp.com)

The Angular app lets user:

- Log in anonymously to the database.
- Find customers.
- Add customers.

## How to set it up?

The Angular app (['frontend/'](frontend)) and Node.js service (['backend/'](backend)) are each their own npm project with their own scripts, so that they are easily separable. For convenience, they are bundled into this root ng-node-firebase npm project with its own scripts so that they can also easily be deployed together (e.g. to a single Heroku project). If they are run on different hosts or ports, the url for the backend service should be maintained in the Angular app (as `environment.dataService.url` in ['frontend/src/environments/'](frontend/src/environments)).

### Firebase Database

A Firebase project is required. You'll need to know the URL and Firebase Admin SDK service account private key of an existing one or create a new one. The private key and config object can be downloaded from the Firebase Console. Firebase is used in the Angular app to manage authentication, and in the Express server to check user authentication and to communicate with the database.

- Backend: maintain environment variables `FIREBASE_URL` and `FIREBASE_KEY` for the Express server connection.
- Frontend: maintain the `firebase` config variable in Angular environment in ['frontend/src/environments/'](frontend/src/environments):

```
firebase: {
  apiKey: "...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
}
```

### Heroku

The configured use of Elasticsearch is via Heroku (Bonsai), and the standard deployment option is to Heroku, so it's a good idea to create a Heroku app for this repo ("ng-node-firebase" used for convenience):

```
$ heroku login
Logged in as...
$ cd ng-node-firebase
$ heroku create ng-node-firebase
Creating ⬢ ng-node-firebase... done
https://ng-node-firebase.herokuapp.com/ | https://git.heroku.com/ng-node-firebase.git
```

### Elasticsearch

An Elasticsearch server is required for searching customers. You'll need to know the full access url including credentials ("https://key:secret@host"). A cloud hosted Bonsai Elasticsearch deployment can be easily added to the Heroku app ("ng-node-firebase" used for convenience):

```
$ cd ng-node-firebase
$ heroku addons:create bonsai
Created bonsai-concave-94445 as BONSAI_URL
```

For local development, set environment variable `BONSAI_URL`. Find the value on the created Heroku app's config variables or in the Elasticsearch instance.

### Google Places API service

The Google Place API service is used for address autocompletion. In the Google Cloud Platform console for the project, enable the Google Places API Web Service and get the server API key. Set the key as environment variable `GOOGLE_KEY`.

## How to run it on Heroku

### Manual command line deployment

For the first deployment, environment variables need to be set (using 'ng-node-firebase' for convenience):

```
heroku login
cd ng-node-firebase
heroku config:set FIREBASE_URL=https://ng-node-firebase.firebaseio.com
heroku config:set FIREBASE_KEY={"type": "service_account","project_id":... (Firebase Admin SDK service account private key JSON as single line)
heroku config:set BONSAI_URL=https://key:secret@host (should have been set automatically during add-on creation)
heroku config:set GOOGLE_KEY=(server API key for project on Google Cloud Platform)
```

Thereafter, each deployment simply needs:

```
heroku login
cd ng-node-firebase
git push heroku master
```

### Automatic deployment

Just pull to `master` to deploy automatically once initial setup has been done.

For initial time setup:

1. Connect Heroku app to a Heroku pipeline, connect pipeline to GitHub repo and enable automatic deployment.

2. Set environment variables:

```
FIREBASE_URL=https://ng-node-firebase.firebaseio.com
FIREBASE_KEY={"type": "service_account","project_id":... (Firebase Admin SDK service account private key JSON as single line)
BONSAI_URL=https://key:secret@host (should have been set automatically during add-on creation)
GOOGLE_KEY=(server API key for project on Google Cloud Platform)
```

## How to run it elsewhere or locally

For running together, do the following in repo root; for standalone mode, do it in each of ['/backend'](backend/) and ['/frontend'](frontend/).

1. Set environment variables:

```
FIREBASE_URL=https://ng-node-firebase.firebaseio.com
FIREBASE_KEY={"type": "service_account","project_id":... (Firebase Admin SDK service account private key JSON as single line)
BONSAI_URL=https://key:secret@host
GOOGLE_KEY=(server API key for project on Google Cloud Platform)
PORT=3000
```

2. Run `npm install`.

3. Run 'npm start'.

## Setting environment variables

For local development: in ['backend/.env'](backend/.env) (for standalone mode) and ['/.env'](.env) (for running together).

For Heroku: in project console ('Settings -> Config Variables') or CLI ('ng-node-firebase' used for convenience):

```
heroku login
cd ng-node-firebase
heroku config:set VARIABLE=value
```
