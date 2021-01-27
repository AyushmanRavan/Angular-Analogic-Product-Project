import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductivityComponent } from './productivity.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './.././../shared/modules/shared.module';
import { OeeService }  from './../oee.service';
const productivityRoutes: Routes = [
  {
    path: '',
    component: ProductivityComponent
  },
  {
    path: ':machineID',
    component: ProductivityComponent
  }
];
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(productivityRoutes),SharedModule
  ],
  declarations: [ProductivityComponent],
  providers:[OeeService]
})
export class ProductivityModule { }
