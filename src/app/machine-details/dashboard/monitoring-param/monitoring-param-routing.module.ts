import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoringParamComponent } from "./monitoring-param.component";

const routes: Routes = [
  {    path: '',    component: MonitoringParamComponent  }
  // {
  //   path: '/:machineName',
  //   component: MonitoringParamComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringParamRoutingModule { }
