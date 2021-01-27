import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// import { SpinnerModule } from "../components/spinner/";
// import { MaterialModule } from "../material/material.module";
import { SharedModule } from "../shared/modules/shared.module";
import { MachineRoutingModule } from "./machine-routing.module";
import { PipesModule } from "../shared/pipes/pipe.module";
import { MachineComponent } from "./machine.component";
import { MachineService } from "./machine.service";
// import { BarService } from "./shared/svg/bar.service";
// import { BarComponent } from "./shared/svg/bar.component";
// import { BarContainerDirective } from "./shared/svg/bar-container.directive";

import {SharedSvgComponentModule} from "./shared/shared-Svg-Component.module"

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule,
    MachineRoutingModule,
    PipesModule,
    SharedModule,
    SharedSvgComponentModule
    // SpinnerModule
  ],
  // declarations: [BarComponent, BarContainerDirective, MachineComponent],
  // providers: [BarService, MachineService]
  declarations: [ MachineComponent],
  providers: [MachineService]
})
export class MachineModule {}
