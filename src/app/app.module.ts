import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ProductService } from "src/app/core/services/product.service";
import { LogisticService } from "src/app/core/services/logistic.service";
import { AngularMaterialModule } from "./core/modules/angular-material-module/angular-material-module";
import { ToastrModule } from "ngx-toastr";
import { FeatureModule } from "./features/feature-module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    FeatureModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: "toast-bottom-right"
    })
  ],
  providers: [HttpClientModule, ProductService, LogisticService],
  bootstrap: [AppComponent]
})
export class AppModule {}
