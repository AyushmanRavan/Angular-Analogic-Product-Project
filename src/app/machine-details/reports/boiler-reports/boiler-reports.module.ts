import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoilerReportsRoutingModule } from './boiler-reports-routing.module';
import { BoilerReportsComponent } from "./boiler-reports.component";

import { SharedModule } from "../../../shared/modules/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReportFormComponent } from "./../../../reports/report-form/report-form.component"
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";

import { ReportsModule } from "../../../reports/reports.module";

import { ReportsService } from "./../../../reports/reports.service";

import { ConfigurationService } from '../../../configuration/configuration.service';

import { SharedComponentModule } from "../../../shared-component/shared-component.module";

import { BoilerReportsService } from "./boiler-reports.service";

@NgModule({
  imports: [
    CommonModule,
    BoilerReportsRoutingModule,
    SharedModule,
    // FormsModule,
    // ReactiveFormsModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule    
    SharedComponentModule
  ],
  declarations: [BoilerReportsComponent],
  providers: [BoilerReportsService]
})
export class BoilerReportsModule { }
