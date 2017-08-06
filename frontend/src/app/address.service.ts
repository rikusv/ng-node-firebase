import { Injectable } from '@angular/core';

import { Http }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../environments/environment';

import { Address } from './address';

@Injectable()
export class AddressService {

  constructor(private http: Http) { }

  uri = environment.dataService.url + environment.dataService.path;

  search(term: string): Observable<Address[]> {
    return this.http
      .get(this.uri + `/_utils/autocomplete/address?input=${term}`)
      .map(response => response.json().data as Address[]);
  }
}
