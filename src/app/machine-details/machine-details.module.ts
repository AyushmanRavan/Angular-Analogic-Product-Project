import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from "../core/core.module";
import { MachineDetailsRoutingModule } from "./machine-details.routing.module"
import { SharedModule } from "../shared/modules/shared.module";
import { MachineDetailsComponent } from "./machine-details.component";
import { PipesModule } from "../shared/pipes/pipe.module";
import { MachineService } from "../machine/machine.service";
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { DefaultMachineDbComponent } from "./common/default-machine-db/default-machine-db.component"

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MachineDetailsRoutingModule,
    PipesModule,
    SharedModule,
    PDFExportModule,
  ],
  declarations: [
    MachineDetailsComponent,
    DefaultMachineDbComponent,
  ],

  providers: [MachineService],
  entryComponents: [],
  exports: []
})
export class MachineDetailsModule { }
