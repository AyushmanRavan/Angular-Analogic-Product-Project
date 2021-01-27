import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AirCompressorReportsComponent} from "./air-compressor-reports.component"

const routes: Routes = [

  {
    path: "",
    component: AirCompressorReportsComponent
    
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirCompressorReportsRoutingModule { }
