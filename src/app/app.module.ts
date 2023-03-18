import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TrackingComponent } from './features/tracking/tracking.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ProductsTrackingComponent } from './features/products-tracking/products-tracking.component';  
import { ProductService } from 'src/app/core/services/product.service';
import { LogisticService } from 'src/app/core/services/logistic.service';

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
