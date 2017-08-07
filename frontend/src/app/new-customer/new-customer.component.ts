import { Component, OnInit, ViewChild } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import { NgForm, FormControl, Validators } from '@angular/forms';
import {MdSnackBar} from '@angular/material';

import { HttpClient } from '@angular/common/http'; // to be moved to separate service
import { HttpHeaders } from '@angular/common/http'; // to be moved to separate service
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { environment } from '../../environments/environment';

import { Address } from '../address';
import { AddressService } from '../address.service';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

import { LoginComponent } from '../login/login.component';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const ZA_ID_REGEX = /^\d{13}$/;

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
  providers: [CustomerService, AddressService]
})
export class NewCustomerComponent implements OnInit {

  @ViewChild("customerForm") customerForm: NgForm;

  addresses: Observable<Address[]>;
  private addressSearchTerms = new Subject<string>();

  constructor(
    private customerService: CustomerService,
    private addressService: AddressService,
    private http: HttpClient,
    public snackBar: MdSnackBar,
    public dialog: MdDialog
  ) { }

  customer = new Customer()

  title = 'Add'

  loading = false

  uri = environment.dataService.url + environment.dataService.path;

  emailFormControl = new FormControl('', [
    Validators.pattern(EMAIL_REGEX)]);

  idNumberFormControl = new FormControl('', [
    Validators.pattern(ZA_ID_REGEX)]);

  onSubmit() {
    this.loading = true;
    this.http
      .post(this.uri + '/customers', this.customer)
      .subscribe(
      data => {
        setTimeout(function() {
          this.loading = false;
        }.bind(this), 500)
        // this.loading = false;
        this.snackBar.open(data['message'],
          'Okay',
          {
            duration: 5000,
          });
        this.customer = new Customer();
        this.customerForm.form.reset();
      },
      err => {
        setTimeout(function() {
          this.loading = false;
        }.bind(this), 500)
        var error = err.hasOwnProperty('error') ? err.error : err,
          message = error.hasOwnProperty('message') ? error.message : 'Unknown error',
          detail = error.hasOwnProperty('detail') ? error.detail : null;
        if (detail) {
          message = message + ' - ' + JSON.stringify(detail);
        }
        if (detail.hasOwnProperty('code') && detail['code'] === 'auth/argument-error') {
          this.dialog.open(LoginComponent);
        }
        console.error('Error while posting', error);

        this.snackBar.open(message,
          'Okay',
          {
            duration: 5000,
          });
      }
      );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.addressSearchTerms.next(term);
  }

  ngOnInit(): void {
    this.addresses = this.addressSearchTerms
      .debounceTime(300) // keystroke delay
      .distinctUntilChanged() // don't search same term again
      .switchMap(term => term // switch to new observable each time the term changes
        // return the http search observable
        ? this.addressService.search(term)
        // or empty if no search term
        : Observable.of<Address[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of<Address[]>([]);
      });
  }

}
