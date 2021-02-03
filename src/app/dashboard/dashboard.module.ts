import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/modules/shared.module";
import { PipesModule } from "../shared/pipes/pipe.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardService } from "./dashboard.service";
import { DashboardComponent } from "./dashboard.component";
import { DefaultComponent } from "./default/default.component";
import {MachineService} from "../machine/machine.service";
import { MaterialModule } from "../material/material.module";


@NgModule({
  imports: [ 
    CommonModule, 
    CoreModule,
    DashboardRoutingModule,
    PipesModule,
    SharedModule ,
    MaterialModule,
  ],
  declarations: [DashboardComponent, DefaultComponent],
  providers: [DashboardService, MachineService]
})
export class DashboardModule {}
