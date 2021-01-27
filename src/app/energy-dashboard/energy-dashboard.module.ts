import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnergyDashboardComponent } from './energy-dashboard.component';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "./../shared/modules/shared.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EnergyDashboardService } from './energy-dashboard.service';
const routes: Routes = [
  {
    path: "",
    component: EnergyDashboardComponent
  },
  {
    path: ":machineName",
    component: EnergyDashboardComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule,FormsModule, ReactiveFormsModule],
  providers: [EnergyDashboardService],
  declarations: [EnergyDashboardComponent]
})
export class EnergyDashboardModule { }
