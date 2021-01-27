import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatIconModule,
  MatMenuModule,
  MatButtonModule
} from "@angular/material";
import { NewPdfService } from './new-pdf.service';
import { NewPdfComponent } from "./new-pdf.component";

const MaterialModules = [MatIconModule, MatMenuModule, MatButtonModule];

@NgModule({
  imports: [CommonModule, ...MaterialModules],
  declarations: [NewPdfComponent],
  providers: [NewPdfService],
  exports: [NewPdfComponent]
})
export class NewPdfModule { }
