import { Injectable } from '@angular/core';

// interface SharedUserData {
//   [token: string]: any;
// }

@Injectable()
export class UserService {
  constructor() {
    this.token = this.token;
  }

  token: string

  getToken() {
    return this.token
  }

  setToken(token) {
    this.token = token
  }

}
