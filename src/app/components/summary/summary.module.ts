import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { MaterialModule } from '../../material/material.module';
import { PipesModule } from '../../shared/pipes/pipe.module';

@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    PipesModule,
    MaterialModule,
  ],
  exports: [SummaryComponent]
})
export class SummaryModule { }
