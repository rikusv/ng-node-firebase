import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from './user.service';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  status = new Subject<string>();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    public afAuth: AngularFireAuth,
  ) {
    this.user = afAuth.authState;
  }

  user: Observable<firebase.User>

  signIn() {
    this.status.next('Busy');
    var authService = this;
    this.afAuth.auth.signInAnonymously()
      .then(data => {
        this.status.next('Done');
      })
      .catch((err: firebase.FirebaseError) => {
        this.status.next('Failed');
        if (err.code === 'auth/operation-not-allowed') {
          console.error('You must enable Anonymous auth in the Firebase Console.');
        } else {
          console.error('Error while signing in', err);
        }
      });
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.status.next('')
    this.userService.setToken(null);
  }

}
