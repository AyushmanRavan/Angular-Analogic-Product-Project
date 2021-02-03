import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/modules/shared.module";

import { MachineReportRoutingModule } from './machine-report-routing.module';

import {MachineReportService} from "./machine-report.service";

import {MachineReportComponent} from "./machine-report.component";

import {SharedComponentModule} from "../../../shared-component/shared-component.module"
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MachineReportRoutingModule,
    SharedModule,
    MaterialModule,
    SharedComponentModule
  ],
  declarations: [MachineReportComponent],
  providers : [MachineReportService]
})
export class MachineReportModule { }
