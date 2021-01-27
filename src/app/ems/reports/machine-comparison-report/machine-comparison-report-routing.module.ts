import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MachineComparisonReportComponent} from './machine-comparison-report.component';
const machineComparisonReportroutes: Routes = [
  {
    path : '',
    component : MachineComparisonReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(machineComparisonReportroutes)],
  exports: [RouterModule]
})
export class MachineComparisonReportRoutingModule { }
