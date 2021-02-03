import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ErrorComponent]
})
export class ErrorModule { }
