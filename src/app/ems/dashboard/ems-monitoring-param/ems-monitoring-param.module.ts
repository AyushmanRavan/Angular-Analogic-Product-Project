import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "./../../../shared/modules/shared.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EmsMonitoringParamRoutingModule } from './ems-monitoring-param-routing.module';
import { EmsMonitoringParamComponent } from './ems-monitoring-param.component';
import { EmsMonitoringParamService } from './ems-monitoring-param.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EmsMonitoringParamRoutingModule
  ],
  declarations: [EmsMonitoringParamComponent],
  providers : [EmsMonitoringParamService]
})
export class EmsMonitoringParamModule { }
