import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AlarmReportComponent} from "./alarm-report.component"

const routes: Routes = [{
  path: "",
  component: AlarmReportComponent
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmReportRoutingModule { }
