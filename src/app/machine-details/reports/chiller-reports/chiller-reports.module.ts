import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChillerReportsRoutingModule } from './chiller-reports-routing.module';

import {ChillerReportsComponent} from "./chiller-reports.component"

import {SharedComponentModule} from "../../../shared-component/shared-component.module"

import { SharedModule } from "../../../shared/modules/shared.module";

import {ChillerReportsService} from "./chiller-reports.service";

 

@NgModule({
  imports: [
    CommonModule,
    ChillerReportsRoutingModule,
    SharedModule,
    SharedComponentModule 
  ],
  declarations: [ChillerReportsComponent],
  providers:[ChillerReportsService]  
})
export class ChillerReportsModule { }
