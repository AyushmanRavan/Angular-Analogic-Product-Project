import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatIconModule,
  MatMenuModule,
  MatButtonModule
} from "@angular/material";

import { PdfComponent } from "./pdf.component";
import { PdfService } from "./pdf.service";

const MaterialModules = [MatIconModule, MatMenuModule, MatButtonModule];

@NgModule({
  imports: [CommonModule, ...MaterialModules],
  declarations: [PdfComponent],
  providers: [PdfService],
  exports: [PdfComponent]
})
export class PdfModule {}
