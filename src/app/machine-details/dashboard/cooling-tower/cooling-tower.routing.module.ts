import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CoolingTowerComponent } from "./cooling-tower.component"



const coolingRoutes: Routes = [
  {
    path: "",
    component: CoolingTowerComponent
    
  }
  
 
];
@NgModule({
  imports: [RouterModule.forChild(coolingRoutes)],
  exports: [RouterModule]
})
export class CoolingTowerRoutingModule {}
