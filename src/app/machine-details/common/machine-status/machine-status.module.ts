import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from "../../../shared/modules/shared.module";

import { PipesModule } from "../../../shared/pipes/pipe.module";
import { MachineStatusComponent } from "./machine-status.component";
import { MachineStatusService } from "./machine-status.service";
// import { BarService } from "./shared/svg/bar.service";
// import { BarComponent } from "./shared/svg/bar.component";
// import { BarContainerDirective } from "./shared/svg/bar-container.directive";

import {SharedSvgComponentModule} from "./../../../machine/shared/shared-Svg-Component.module"

import { MachineStatusRoutingModule } from './machine-status-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MachineStatusRoutingModule,
    SharedModule,
    PipesModule,
    SharedSvgComponentModule
  ],
  declarations: [MachineStatusComponent],
  providers:[MachineStatusService]
})
export class MachineStatusModule { }
