import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/modules/shared.module";


import { AlarmReportRoutingModule } from './alarm-report-routing.module';

import {AlarmReportComponent} from "./alarm-report.component";

import {AlarmReportService} from "./alarm-report.service";

import {SharedComponentModule} from "../../../shared-component/shared-component.module"

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedComponentModule,
    AlarmReportRoutingModule
  ],
  declarations: [AlarmReportComponent],
  providers : [AlarmReportService]
})
export class AlarmReportModule { }
