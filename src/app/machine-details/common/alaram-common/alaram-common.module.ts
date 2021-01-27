import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "../../../shared/modules/shared.module";

import { AlaramCommonRoutingModule } from './alaram-common-routing.module';

import {AlaramCommonComponent} from "./alaram-common.component"

  import {AlaramCommonService} from "./alaram-common.service"


@NgModule({
  imports: [
    CommonModule,
    AlaramCommonRoutingModule,
    SharedModule
  ],
  declarations: [AlaramCommonComponent],
  providers : [AlaramCommonService]
})
export class AlaramCommonModule { }
