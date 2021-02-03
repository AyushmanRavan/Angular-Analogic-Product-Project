import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatIconModule } from '@angular/material/icon';

import { PdfComponent } from "./pdf.component";
import { PdfService } from "./pdf.service";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";

const MaterialModules = [MatIconModule, MatMenuModule, MatButtonModule];

@NgModule({
  imports: [CommonModule, ...MaterialModules],
  declarations: [PdfComponent],
  providers: [PdfService],
  exports: [PdfComponent]
})
export class PdfModule { }
