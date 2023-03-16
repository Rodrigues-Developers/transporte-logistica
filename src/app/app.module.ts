import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TrackingComponent } from './tracking/tracking.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProductService } from './product.service';
import { LogisticService } from './logistic.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ProductsTrackingComponent } from './products-tracking/products-tracking.component';  

@NgModule({
  declarations: [
    AppComponent,
    TrackingComponent,
    RegistrationComponent,
    ProductsTrackingComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],

  providers: [HttpClientModule, ProductService, LogisticService],
  bootstrap: [AppComponent]
})

export class AppModule { }
