import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { environment } from '../../environments/environment';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-find-customer',
  templateUrl: './find-customer.component.html',
  styleUrls: ['./find-customer.component.css'],
  providers: [CustomerService]
})
export class FindCustomerComponent implements OnInit {

  customers: Observable<Customer[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  uri = environment.dataService.url + environment.dataService.path;

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.customers = this.searchTerms
      .debounceTime(300) // keystroke delay
      .distinctUntilChanged() // don't search same term again
      .switchMap(term => term // switch to new observable each time the term changes
        // return the http search observable
        ? this.customerService.search(term)
        // or empty if no search term
        : Observable.of<Customer[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of<Customer[]>([]);
      });
  }

  gotoDetail(customer: Customer): void {
    alert('Customer view to be implemente')
    // let link = ['/view', customer.id];
    // this.router.navigate(link);
  }


}
