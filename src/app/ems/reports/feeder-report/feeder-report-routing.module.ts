import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeederReportComponent} from './feeder-report.component';
const FeederReportroutes: Routes = [
  {
    path : '',
    component : FeederReportComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(FeederReportroutes)],
  exports: [RouterModule]
})
export class FeederReportRoutingModule { }
