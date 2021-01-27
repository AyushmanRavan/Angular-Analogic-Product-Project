import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverallOeeComponent } from './overall-oee.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './.././../shared/modules/shared.module';
import { OeeService} from './../oee.service';
const overallRoutes: Routes = [
  {
    path: '',
    component: OverallOeeComponent
  },
  {
    path: ':machineID',
    component: OverallOeeComponent
  }
];
@NgModule({
  imports: [
   
    CommonModule,RouterModule.forChild(overallRoutes),SharedModule
  ],
  declarations: [OverallOeeComponent],
  exports: [RouterModule ],
  providers:[OeeService]
})
export class OverallOeeModule { }
