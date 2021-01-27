import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoilerRoutingRoutingModule} from "./boiler.routing.module"
import { SharedModule } from "../../../shared/modules/shared.module";
import { BoilerComponent } from "./boiler.component"

import {BoilerService} from "./boiler.service";


@NgModule({
  imports: [
    CommonModule,
    BoilerRoutingRoutingModule,
    SharedModule
  ],
  declarations: [BoilerComponent],
  providers : [BoilerService]
})
export class BoilerModule { }
