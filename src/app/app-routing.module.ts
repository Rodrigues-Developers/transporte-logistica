import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingComponent } from './tracking/tracking.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {path: '', redirectTo: "/tracking", pathMatch: "full"},
  {path: 'tracking', component: TrackingComponent},
  {path: 'registration', component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
