import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { PccRoutingModule } from './pcc-routing.module';
import {PccComponent } from './pcc.component';
import {PccService} from './pcc.service'
@NgModule({
  imports: [
    CommonModule,
    PccRoutingModule,
    SharedModule
  ],
  declarations: [PccComponent],
  providers : [PccService]

})
export class PccModule { }
