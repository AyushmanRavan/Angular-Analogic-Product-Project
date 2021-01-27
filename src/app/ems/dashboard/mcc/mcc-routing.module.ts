import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MccComponent} from './mcc.component';
const MCCroutes: Routes = [
  {
    path: '',
    component: MccComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(MCCroutes)],
  exports: [RouterModule]
})
export class MccRoutingModule { }
