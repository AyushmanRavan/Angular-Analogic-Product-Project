import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MccReportComponent } from './mcc-report.component';
import { MccReportService } from './mcc-report.service';
// import { NewPdfComponent} from '../../../new-pdf/new-pdf.component';
import { MccReportRoutingModule } from './mcc-report-routing.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import {SharedComponentModule} from '../../../shared-component/shared-component.module' ;
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
// import { PlantDetailsComponent} from '../../../new-pdf/plant-details/plant-details.component'
// import { SummaryTableComponent} from '../../../new-pdf/summary-table/summary-table.component';
// import {MonitoringDetailsComponent} from '../../../new-pdf/monitoring-details/monitoring-details.component'
@NgModule({
  imports: [
    CommonModule,
    MccReportRoutingModule,
    SharedModule,
    SharedComponentModule,
    PDFExportModule
  ],
  declarations: [MccReportComponent],
  providers : [MccReportService],
//  entryComponents : [NewPdfComponent]
})
export class MccReportModule { }
