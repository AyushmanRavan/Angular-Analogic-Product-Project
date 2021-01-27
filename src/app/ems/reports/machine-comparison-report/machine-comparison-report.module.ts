import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MachineComparisonReportRoutingModule } from './machine-comparison-report-routing.module';
import { MachineComparisonReportComponent } from './machine-comparison-report.component';
import { MaterialModule } from '../../../material/material.module';
import { CoreModule } from '../../../core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SpinnerModule } from '../../../components/spinner';
import { SharedModule } from '../../../shared/modules/shared.module' ;
import {MachineComparisonReportService} from './machine-comparison-report.service';
// import {NewPdfComponent} from '../../../new-pdf/new-pdf.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CoreModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SpinnerModule,
    SharedModule,
    MachineComparisonReportRoutingModule
  ],
  declarations: [MachineComparisonReportComponent],
  providers : [MachineComparisonReportService],
  // entryComponents : [NewPdfComponent]
})
export class MachineComparisonReportModule { }
