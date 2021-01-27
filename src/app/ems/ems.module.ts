import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmsComponent} from './ems.component';
import { EmsRoutingModule} from './ems-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/modules/shared.module';
import { PipesModule } from '../shared/pipes/pipe.module';
import {MachineService} from '../machine/machine.service';
import {SharedComponentModule} from '../shared-component/shared-component.module';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
//import {NewPdfComponent} from '../new-pdf/new-pdf.component';
//import {MonitoringDetailsComponent} from '../new-pdf/monitoring-details/monitoring-details.component';
//import {PlantDetailsComponent} from '../new-pdf/plant-details/plant-details.component';
//import {SummaryTableComponent} from '../new-pdf/summary-table/summary-table.component';
// import { FeederComponent } from './reports/feeder/feeder.component';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    EmsRoutingModule,
    SharedModule, 
    PipesModule,
    SharedComponentModule,
    PDFExportModule
  ],
  declarations: [EmsComponent],
  providers: [MachineService],
})
export class EmsModule { }
