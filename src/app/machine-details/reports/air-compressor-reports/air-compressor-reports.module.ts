import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AirCompressorReportsComponent} from "./air-compressor-reports.component"

import { AirCompressorReportsRoutingModule } from './air-compressor-reports-routing.module';
import { SharedModule } from "../../../shared/modules/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {ReportFormComponent} from "./../../../reports/report-form/report-form.component"
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";

import { ReportsService } from "./../../../reports/reports.service";

import {ConfigurationService} from '../../../configuration/configuration.service';

import {SharedComponentModule} from "../../../shared-component/shared-component.module"

import {AirCompressorReportsService} from "./air-compressor-reports.service";

@NgModule({
  imports: [
    CommonModule,
    AirCompressorReportsRoutingModule,
    SharedModule,
    // FormsModule,
    // ReactiveFormsModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
     SharedComponentModule
  ],
  declarations: [AirCompressorReportsComponent],
  providers: [AirCompressorReportsService]
})
export class AirCompressorReportsModule { }
