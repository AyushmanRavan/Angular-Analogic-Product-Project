import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OeeComponent } from './oee.component';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/modules/shared.module";
import {OeeService} from './oee.service';
import { NgxGaugeModule } from 'ngx-gauge';

const routes: Routes = [
  {
    path: "",
    component: OeeComponent,
    children: [
      {
        path: "overall",
        loadChildren: "./overall-oee/overall-oee.module#OverallOeeModule"
      },
      {
        path: "productivity",
        loadChildren: "./productivity/productivity.module#ProductivityModule"
      }, {
        path: "availability",
        loadChildren: "./availability/availability.module#AvailabilityModule"
      },
      {
        path: "quality",
        loadChildren: "./quality/quality.module#QualityModule"
      } 
   ]
  }
];


@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule,NgxGaugeModule

  ],
  declarations: [OeeComponent],
  providers:[OeeService]
})
export class OeeModule { }
