import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionComponent } from './selection.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SelectionService } from './selection.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SelectionComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SelectionComponent],
  providers: [SelectionService]
})
export class SelectionModule { }
