import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../core/modules/angular-material-module/angular-material-module";
import { ToastrModule } from "ngx-toastr";

import { DetailsComponent } from "../shared/details/details.component";
import { DeliveredComponent } from "./delivered/delivered.component";
import { ProductsTrackingComponent } from "./products-tracking/products-tracking.component";
import { RegistrationComponent } from "./registration/registration.component";
import { TrackingComponent } from "./tracking/tracking.component";
import { TransportDetailTableComponent } from "./transport-detail-table/transport-detail-table.component";
import { PopupComponent } from "../shared/popup/popup.component";
import { PopupStateService } from "../core/services/popup-state.service";
@NgModule({
  declarations: [
    DetailsComponent,
    PopupComponent,
    DeliveredComponent,
    ProductsTrackingComponent,
    RegistrationComponent,
    TrackingComponent,
    TransportDetailTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: "toast-bottom-right"
    })
  ],
  providers: [PopupStateService],
  exports: [
    DetailsComponent,
    DeliveredComponent,
    ProductsTrackingComponent,
    RegistrationComponent,
    TrackingComponent,
    TransportDetailTableComponent
  ]
})
export class FeatureModule {}
