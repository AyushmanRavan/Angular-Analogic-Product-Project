import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PccReportComponent } from './pcc-report.component'
const PccReportroutes: Routes = [
  {
    path : '',
    component : PccReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(PccReportroutes)],
  exports: [RouterModule]
})
export class PccReportRoutingModule { }
