import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AlarmComponent } from "./alarm.component";


const alarmRoutes: Routes = [
  {
    path: "",
    component: AlarmComponent
  },
  {
    path: ":machineName",
    component: AlarmComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(alarmRoutes)],
  exports: [RouterModule]
})
export class AlaramRoutingModule {}
