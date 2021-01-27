import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterMonitoringComponent } from './parameter-monitoring.component';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "./../shared/modules/shared.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ParameterMonitoringService } from './parameter-monitoring.service';

const routes: Routes = [
  {
    path: "",
    component: ParameterMonitoringComponent
  },
  {
    path: ":machineName",
    component: ParameterMonitoringComponent
  }
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule,FormsModule, ReactiveFormsModule
  ],
  providers:[ParameterMonitoringService],
  declarations: [ParameterMonitoringComponent]
})
export class ParameterMonitoringModule { }
