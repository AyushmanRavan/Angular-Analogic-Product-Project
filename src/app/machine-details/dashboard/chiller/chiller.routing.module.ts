import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ChillerComponent } from "./chiller.component"



const chillerRoutes: Routes = [
  {
    path: "",
    component: ChillerComponent
    
  }
  
 
];
@NgModule({
  imports: [RouterModule.forChild(chillerRoutes)],
  exports: [RouterModule]
})
export class ChillerRoutingModule {}
