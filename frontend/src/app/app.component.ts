import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.user = this.authService.afAuth.authState;
  }


  user: Observable<firebase.User>

  // loading = false

  ngOnInit() {
    this.authService.check();
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

}
