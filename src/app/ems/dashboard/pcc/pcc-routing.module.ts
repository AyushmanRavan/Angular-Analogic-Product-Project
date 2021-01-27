import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PccComponent} from './pcc.component';
const PCCroutes: Routes = [
  {
    path : '',
    component : PccComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(PCCroutes)],
  exports: [RouterModule]
})
export class PccRoutingModule { }
