import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MachineStatusComponent } from "./machine-status.component";

const routes: Routes = [ {
  path: '',
  component: MachineStatusComponent
},
{
  path: ':machineName',
  component: MachineStatusComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineStatusRoutingModule { }
