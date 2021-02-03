import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PccReportComponent} from './pcc-report.component';
import {PccReportService} from './pcc-report.service';
// import { NewPdfComponent} from '../../../new-pdf/new-pdf.component';
import { PccReportRoutingModule } from './pcc-report-routing.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import {SharedComponentModule} from '../../../shared-component/shared-component.module' ;
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    PccReportRoutingModule,
    SharedModule,
    MaterialModule,
    SharedComponentModule,
    PDFExportModule
  ],
  declarations: [ PccReportComponent],
  providers : [PccReportService],
 // entryComponents : [NewPdfComponent]
})
export class PccReportModule { }
