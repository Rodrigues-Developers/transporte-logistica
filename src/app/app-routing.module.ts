import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingComponent } from './tracking/tracking.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProductsTrackingComponent } from './products-tracking/products-tracking.component';

const routes: Routes = [
  {path: '', redirectTo: "/productsTracking", pathMatch: "full"},
  {path: 'productsTracking', component: ProductsTrackingComponent},
  {path: 'tracking', component: TrackingComponent},
  {path: 'registration', component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
