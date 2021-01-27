import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CoolingTowerReportsComponent} from "./cooling-tower-reports.component"


import { CoolingTowerReportsRoutingModule } from './cooling-tower-reports-routing.module';

import {SharedComponentModule} from "../../../shared-component/shared-component.module"

import { SharedModule } from "../../../shared/modules/shared.module";

import {CoolingTowerReportsService} from "./cooling-tower-reports.service";

@NgModule({
  imports: [
    CommonModule,
    CoolingTowerReportsRoutingModule,
    SharedModule,
    SharedComponentModule
  ],
  declarations: [CoolingTowerReportsComponent],
  providers:[CoolingTowerReportsService]
})
export class CoolingTowerReportsModule { }
