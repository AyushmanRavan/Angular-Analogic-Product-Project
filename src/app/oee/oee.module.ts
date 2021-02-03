import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OeeComponent } from './oee.component';
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/modules/shared.module";
import { OeeService } from './oee.service';
import { NgxGaugeModule } from 'ngx-gauge';

const routes: Routes = [
  {
    path: "", component: OeeComponent,
    children: [
      { path: "overall", loadChildren: () => import('./overall-oee/overall-oee.module').then(aircompressor => aircompressor.OverallOeeModule) },
      { path: "productivity", loadChildren: () => import('./productivity/productivity.module').then(aircompressor => aircompressor.ProductivityModule) },
      { path: "availability", loadChildren: () => import('./availability/availability.module').then(aircompressor => aircompressor.AvailabilityModule) },
      { path: "quality", loadChildren: () => import('./quality/quality.module').then(aircompressor => aircompressor.QualityModule) }
    ]
  }
];


@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule, NgxGaugeModule
  ],
  declarations: [OeeComponent],
  providers: [OeeService]
})
export class OeeModule { }
