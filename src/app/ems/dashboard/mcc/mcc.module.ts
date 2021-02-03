import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MccRoutingModule } from './mcc-routing.module';
import {MccComponent} from './mcc.component';
import {MccService} from './mcc.service';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MccRoutingModule,
  ],
  declarations: [MccComponent],
  providers : [MccService]
})
export class MccModule { }
