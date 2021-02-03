import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NewPdfService } from './new-pdf.service';
import { NewPdfComponent } from "./new-pdf.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

const MaterialModules = [MatIconModule, MatMenuModule, MatButtonModule];

@NgModule({
  imports: [CommonModule, ...MaterialModules],
  declarations: [NewPdfComponent],
  providers: [NewPdfService],
  exports: [NewPdfComponent]
})
export class NewPdfModule { }
