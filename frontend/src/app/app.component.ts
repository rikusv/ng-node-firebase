import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { AuthService } from './auth.service';
import { UserService } from './user.service';

import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public userService: UserService,
    private http: HttpClient,
    public dialog: MdDialog
    // public dialogRef: MdDialogRef<LoginComponent>
  ) {
    this.user = this.authService.afAuth.authState;
  }

  user: Observable<firebase.User>

  ngOnInit() {
    this.user.subscribe(
      x => {
        var userService = this.userService;
        if (x) {
          x.getIdToken().then(function(idToken) {
            userService.setToken(idToken);
          }).catch(function(error) {
            console.error("something went wrong");
          })
        } else {
          this.openDialog()
          this.userService.setToken(null);
        }
      },
      e => console.log('error' + e),
      () => console.log('onCompleted'));
  }

  signIn() {
    this.authService.signIn();
  }

  signOut() {
    this.authService.signOut();
  }

  gotoGithub() {
    window.location.href = 'https://github.com/rikusv/ng-node-firebase';
  }

  openDialog() {
    this.dialog.open(LoginComponent);
  }

}
