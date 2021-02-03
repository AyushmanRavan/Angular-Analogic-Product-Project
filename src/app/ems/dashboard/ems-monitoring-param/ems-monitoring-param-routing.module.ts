import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmsMonitoringParamComponent } from '../ems-monitoring-param/ems-monitoring-param.component';
const routes: Routes = [
  {  path: "",  component: EmsMonitoringParamComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmsMonitoringParamRoutingModule { }
