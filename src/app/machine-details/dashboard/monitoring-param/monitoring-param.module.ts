import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringParamRoutingModule } from './monitoring-param-routing.module';

import {MonitoringParamComponent} from "./monitoring-param.component";

import {MonitoringParamService} from "./monitoring-param.service";

import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "./../../../shared/modules/shared.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MonitoringParamRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [MonitoringParamComponent],
  providers : [MonitoringParamService]
})
export class MonitoringParamModule { }
