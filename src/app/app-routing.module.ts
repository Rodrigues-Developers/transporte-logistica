import { DetailsComponent } from "./shared/details/details.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TrackingComponent } from "./features/tracking/tracking.component";
import { RegistrationComponent } from "./features/registration/registration.component";
import { ProductsTrackingComponent } from './features/products-tracking/products-tracking.component';
import { DeliveredComponent } from 'src/app/features/delivered/delivered.component';

const routes: Routes = [
  { path: '', redirectTo: '/productsTracking', pathMatch: 'full' },
  { path: 'productsTracking', component: ProductsTrackingComponent },
  { path: 'tracking', component: TrackingComponent },
  { path: 'delivered', component: DeliveredComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'details', component: DetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
