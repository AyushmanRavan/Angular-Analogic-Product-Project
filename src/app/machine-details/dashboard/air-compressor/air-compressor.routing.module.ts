import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AirCompressorComponent } from "./air-compressor.component";



const aircompressorRoutes: Routes = [
  {
    path: "",
    component: AirCompressorComponent
    
  }
  
 
];
@NgModule({
  imports: [RouterModule.forChild(aircompressorRoutes)],
  exports: [RouterModule]
})
export class AirCompressorRoutingRoutingModule {}
