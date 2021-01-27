import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MccRoutingModule } from './mcc-routing.module';
import {MccComponent} from './mcc.component';
import {MccService} from './mcc.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MccRoutingModule,
  ],
  declarations: [MccComponent],
  providers : [MccService]
})
export class MccModule { }
