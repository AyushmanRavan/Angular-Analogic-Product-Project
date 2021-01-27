import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlaramCommonComponent} from "./alaram-common.component"

const routes: Routes = [{
  path: "",
  component: AlaramCommonComponent
  
},
{
  path: 'alarm/:reportType',
  component: AlaramCommonComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlaramCommonRoutingModule { }
