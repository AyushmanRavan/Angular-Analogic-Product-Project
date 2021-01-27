import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { FeederRoutingModule } from './feeder-routing.module';
import { FeederComponent } from './feeder.component';
import {FeederService} from './feeder.service';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FeederRoutingModule
  ],
  declarations: [FeederComponent],
  providers : [FeederService]
})
export class FeederModule { }
