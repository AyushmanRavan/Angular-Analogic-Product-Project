import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CoolingTowerRoutingModule} from "./cooling-tower.routing.module"
import { SharedModule } from "../../../shared/modules/shared.module";

import { CoolingTowerComponent } from "./cooling-tower.component"

import { CoolingTowerService} from "./cooling-tower.service"

@NgModule({
  imports: [
    CommonModule,
    CoolingTowerRoutingModule,
    SharedModule
  ],
  declarations: [CoolingTowerComponent],
  providers : [CoolingTowerService]
})
export class CoolingTowerModule { }
