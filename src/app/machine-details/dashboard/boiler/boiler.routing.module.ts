import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BoilerComponent } from "./boiler.component"



const boilerRoutes: Routes = [
  {
    path: "",
    component: BoilerComponent
    
  }
  
 
];
@NgModule({
  imports: [RouterModule.forChild(boilerRoutes)],
  exports: [RouterModule]
})
export class BoilerRoutingRoutingModule {}
