import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {HomepageComponent} from "./homepage.component";

import { HomepageRoutingModule } from './homepage-routing.module';

import { CoreModule } from "../core/core.module";

import { SharedModule } from "../shared/modules/shared.module";

// import { MachineCategoryComponent } from './machine-category/machine-category.component';
// import {MachineCategoryModule} from './machine-category/machine-category.module'
import { PipesModule } from "../shared/pipes/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    HomepageRoutingModule,
    CoreModule,
    SharedModule,
    PipesModule
  ],
  declarations: [HomepageComponent],
  providers: []
})
export class HomepageModule { }
