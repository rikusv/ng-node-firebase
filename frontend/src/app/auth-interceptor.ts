import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = this.userService.getToken();
    if (token) {
      const newReq = req.clone({
          headers: req.headers.set('Authorization', token)
        });
      return next.handle(newReq);
    } else {
      return next.handle(req);
    }
  }
}
