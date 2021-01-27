import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MccReportComponent} from './mcc-report.component';
import {NewPdfComponent} from '../../../new-pdf/new-pdf.component';
const MccReportroutes: Routes = [
{
  path : '',
  component : MccReportComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(MccReportroutes)],
  exports: [RouterModule]
})
export class MccReportRoutingModule { }
