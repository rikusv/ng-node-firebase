import { Injectable } from '@angular/core';

import { Http }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../environments/environment';

import { Customer } from './customer';

@Injectable()
export class CustomerService {

  constructor(private http: Http) { }

  uri = environment.dataService.url + environment.dataService.path;

  search(term: string): Observable<Customer[]> {
    return this.http
      .get(this.uri + `/customers?$prefix=${term}`)
      .map(response => response.json().data as Customer[]);
  }
}
