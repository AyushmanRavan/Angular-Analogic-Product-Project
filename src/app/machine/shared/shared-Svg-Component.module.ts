import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../../shared/modules/shared.module";

import { BarService } from "./svg/bar.service";
import { BarComponent } from "./svg/bar.component";
import { BarContainerDirective } from "./svg/bar-container.directive";






@NgModule({
  imports: [
    CommonModule,
    SharedModule
    
  ],
  declarations: [BarComponent,BarContainerDirective],
  exports: [
    BarComponent,BarContainerDirective
  ],
  providers: [BarService]
})
export class SharedSvgComponentModule { }
