import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdToolbarModule,
  MdButtonModule,
  MdInputModule,
  MdSidenavModule,
  MdIconModule,
  MdListModule,
  MdMenuModule,
  MdCardModule,
  MdSnackBarModule,
  MdProgressSpinnerModule,
  MdAutocompleteModule
} from '@angular/material';

import { environment } from '../environments/environment';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth-interceptor';

import { CustomerService } from './customer.service';

import { AppComponent } from './app.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { FindCustomerComponent } from './find-customer/find-customer.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/find',
    pathMatch: 'full'
  },
  { path: 'find', component: FindCustomerComponent },
  { path: 'new', component: NewCustomerComponent },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NewCustomerComponent,
    FindCustomerComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // for debugging only!
    ),
    BrowserAnimationsModule,
    MdToolbarModule,
    MdButtonModule,
    MdInputModule,
    MdSidenavModule,
    MdIconModule,
    MdListModule,
    MdMenuModule,
    MdCardModule,
    MdSnackBarModule,
    MdProgressSpinnerModule,
    MdAutocompleteModule
  ],
  providers: [
    CustomerService,
    UserService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
