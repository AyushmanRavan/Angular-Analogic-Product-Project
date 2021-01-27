import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityComponent } from './utility.component';
import { Routes, RouterModule } from "@angular/router";
import { UtilityService } from './utility.service';
import { SharedModule } from "../shared/modules/shared.module";
const routes: Routes = [
  {
    path: "",
    component: UtilityComponent
  },
  {
    path: ":machineName",
    component: UtilityComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UtilityComponent],
  providers: [UtilityService]
})
export class UtilityModule { }