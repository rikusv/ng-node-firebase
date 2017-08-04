import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // to be moved to separate service
import { HttpHeaders } from '@angular/common/http'; // to be moved to separate service
import { Observable }        from 'rxjs/Observable';

import { environment } from '../../environments/environment';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
  providers: [CustomerService]
})
export class NewCustomerComponent implements OnInit {

  @ViewChild("customerForm") customerForm: NgForm;

  constructor(
    private customerService: CustomerService,
    private http: HttpClient) { }

  customer = new Customer()

  uri = environment.dataService.url + environment.dataService.path;

  status = null

  onSubmit() {
    this.http
      .post(this.uri + '/customers', this.customer)
      .subscribe(
      data => {
        console.log(data);
        this.status = data['message'];
        this.customer = new Customer();
        this.customerForm.form.reset();
      },
      err => {
        console.log(err)
        this.status = err.error.message + '. ' + err.error.detail
      }
      );
  }

  ngOnInit() { }

}
