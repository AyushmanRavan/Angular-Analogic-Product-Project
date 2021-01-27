import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChillerRoutingModule} from "./chiller.routing.module"
import { SharedModule } from "../../../shared/modules/shared.module";
import { ChillerComponent } from "./chiller.component"

import { ChillerService} from "./chiller.service"

@NgModule({
  imports: [
    CommonModule,
    ChillerRoutingModule,
    SharedModule
  ],
  declarations: [ChillerComponent],
  providers : [ChillerService]
})
export class ChillerModule { }
