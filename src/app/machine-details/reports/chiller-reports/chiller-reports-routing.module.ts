import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ChillerReportsComponent} from "./chiller-reports.component"

const routes: Routes = [{
  path: "",
  component: ChillerReportsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChillerReportsRoutingModule { }
