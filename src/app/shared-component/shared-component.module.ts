import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "../material/material.module";
import { ReportFormComponent } from "../reports/report-form/report-form.component";
import { SummaryContentComponent } from '../components/summary-content/summary-content.component';
import { ReportsService } from "../reports/reports.service";
import { ConfigurationService } from '../configuration/configuration.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [ReportFormComponent, SummaryContentComponent],
  exports: [ReportFormComponent, SummaryContentComponent],
  providers: [ReportsService, ConfigurationService]
})
export class SharedComponentModule { }
