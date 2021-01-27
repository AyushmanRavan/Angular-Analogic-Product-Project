import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityComponent } from './quality.component';
import { OeeService} from './../oee.service';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/modules/shared.module";

const qualityRoutes: Routes = [
  {
    path: '',
    component: QualityComponent
  },
  {
    path: ':machineID',
    component: QualityComponent
  }
];
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(qualityRoutes),
    SharedModule
    ],
  declarations: [QualityComponent],
  providers:[OeeService]
})
export class QualityModule { }
