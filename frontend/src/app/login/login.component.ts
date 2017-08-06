import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import {MdDialog} from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.status = this.authService.status;
  }

  status: Observable<any>

  ngOnInit() {
    this.authService.status.subscribe(
      x => console.log(x),
      e => console.log(e)
    )
    // this.authService.status.next('Please sign in');
  }

  signIn() {
    this.authService.signIn();
  }

  signOut() {
    this.authService.signOut();
  }

  gotoNewCustomer() {
    let link = ['/new'];
    this.router.navigate(link);
  }

  gotoFindCustomer() {
    let link = ['/find'];
    this.router.navigate(link);
  }

}
