import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeederReportService } from './feeder-report.service';
import { FeederReportRoutingModule } from './feeder-report-routing.module';
import { FeederReportComponent } from './feeder-report.component';
import { SharedModule } from '../../../shared/modules/shared.module';
import {SharedComponentModule} from '../../../shared-component/shared-component.module' ;
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedComponentModule,
    PDFExportModule,
    FeederReportRoutingModule
  ],
  declarations: [FeederReportComponent],
  providers : [FeederReportService]
})
export class FeederReportModule { }
