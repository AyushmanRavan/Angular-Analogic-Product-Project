import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OeeService} from './../oee.service';
import { Routes, RouterModule } from '@angular/router';
import { AvailabilityComponent } from './availability.component';
import { SharedModule } from './../../shared/modules/shared.module';
const availabilityRoutes: Routes = [
  {
    path: '',
    component: AvailabilityComponent
  },
  {
    path: ':id',
    component: AvailabilityComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(availabilityRoutes)
  ],
  declarations: [AvailabilityComponent],
  providers:[OeeService]
})
export class AvailabilityModule { }
