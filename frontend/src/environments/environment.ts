// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCoBrCXJMe15xYQf_XHFFio0VxgKH3_E1Q",
    authDomain: "ng-node-firebase.firebaseapp.com",
    projectId: "ng-node-firebase",
  },
  dataService: {
    url: "http://localhost:3000",
    path: "/api/v1"
  }
};
