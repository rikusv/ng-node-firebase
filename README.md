# ng-node-firebase

## What is this?

A simple web application that captures customer information.

- Required information is ID number, first name, surname and contact information (email, phone and address).
- Customers must be persisted to a data store of your choice.
- Provide a lookup/search into saved customers.

Additional:
- Provide integration into a map control and API for address capture and view
- Search customers by location
- Input validation

## How does it work?

An Angular front-end web application accesses a Firebase database via a Node Express.js backend service. The backend service uses Elasticsearch for search customers.

## How to set it up?

The Angular app (`frontend`) and Node.js service (`backend`) are each their own npm project with their own scripts, so that they are easily separable. For convenience, they are bundled into this root ng-node-firebase npm project with its own scripts so that they can also easily be deployed together (e.g. to a single Heroku project). If they are run on different hosts or ports,  `environment.dataService.url` (frontend/src/environments/environment.prod-standalone.ts) should be maintained in the Angular app to point to the backend service.

### Firebase Database

A Firebase project is required. You'll need to know the URL and Firebase Admin SDK service account private key of an existing one or create a new one. The private key and config object can be downloaded from the Firebase Console. Firebase is used in the Angular app to manage authentication, and in the Express server to check user authentication and to communicate with the database.

- Maintain environment variables `FIREBASE_URL` and `FIREBASE_KEY` for the Express server connection. This can be done in `.env` for local development.
- Maintain `firebase` config variable in Angular environment in `frontend/src/environments` like:

```
firebase: {
  apiKey: "AIzaSyCoBrCXJMe15xYQf_XHFFio0VxgKH3_E1Q",
  authDomain: "ng-node-firebase.firebaseapp.com",
  projectId: "ng-node-firebase",
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

An Elasticsearch server is required. You'll need to know the full access url including credentials ("https://key:secret@host"). A cloud hosted Bonsai Elasticsearch deployment can be easily added to the Heroku app:

```
$ cd ng-node-firebase
$ heroku addons:create bonsai
Created bonsai-concave-94445 as BONSAI_URL
```

For local development, also set BONSAI_URL in `backend/.env` (for standalone mode) and `/.env` (for running together). Check the value on the created Heroku app's config variables or in the Elasticsearch instance.

## How to run it on Heroku

## Manual deployment

set env var

heroku login
cd ng-node-firebase
git push heroku master

### Automatic deployment

Just pull to `master` to deploy automatically once initial setup has been done.

For initial time setup:

1. Connect Heroku app to a Heroku pipeline, connect pipeline to GitHub repo and enable automatic deployment.

2. Set environment variables (see https://devcenter.heroku.com/articles/config-vars):

```
FIREBASE_URL=https://ng-node-firebase.firebaseio.com
FIREBASE_KEY={"type": "service_account","project_id":... (Firebase Admin SDK service account private key JSON as single line)
BONSAI_URL=https://key:secret@host (should have been set automatically during add-on creation)
```

## How to run it elsewhere or locally

For running together, do the following in repo root; for standalone mode, do it in each of `backend` and `frontend`.

1. Set environment variables. For running locally, this can be done in files `/.env` and `backend/.env`:

```
FIREBASE_URL=https://ng-node-firebase.firebaseio.com
FIREBASE_KEY={"type": "service_account","project_id":... (Firebase Admin SDK service account private key JSON as single line)
BONSAI_URL=https://key:secret@host
PORT=3000
```

2. Run `npm install`.

3. Run 'npm start'.
