import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FeederComponent} from './feeder.component';
const FeederRoutes: Routes = [
  {
    path: '',
    component: FeederComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(FeederRoutes)],
  exports: [RouterModule]
})
export class FeederRoutingModule { }
