import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from './user.service';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    public afAuth: AngularFireAuth
  ) {
    this.user = afAuth.authState;
    this.token = afAuth.idToken;
    this.tokenId = '';
  }

  user: Observable<firebase.User>
  token: Observable<firebase.User>
  tokenId: String
  loading = false;

  check() {
    var authService = this;
    this.user.subscribe(
      x => {
        if (x) {
          console.log(x);
          console.log("user change")
          x.getIdToken().then(function(idToken) {
            authService.tokenId = idToken;
            authService.userService.setToken(idToken);

          }).catch(function(error) {
            alert("something went wrong")
          })
        } else {
          authService.userService.setToken(null);
        }
      },
      e => console.log('error' + e),
      () => console.log('onCompleted'));
  }

  signIn() {
    this.loading = true;
    var authService = this;
    this.afAuth.auth.signInAnonymously()
      .then(data => {
        this.loading = false;
      })
      .catch((err: firebase.FirebaseError) => {
        this.loading = false;
        var errorCode = err.code;
        var errorMessage = err.message;
        if (errorCode === 'auth/operation-not-allowed') {
          alert('You must enable Anonymous auth in the Firebase Console.');
        } else {
          console.error(err);
        }
      });
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.userService.setToken(null);
    this.tokenId = '';
  }

}
