import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MachineReportComponent} from "./machine-report.component"

const routes: Routes = [{
  path: "",
  component: MachineReportComponent
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineReportRoutingModule { }
