import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { EnergyReportsComponent } from "./energy-reports/energy-reports.component";
import { ReportFormComponent } from "./report-form/report-form.component";

import {SharedComponentModule} from "../shared-component/shared-component.module";
import { ReportsService } from "./reports.service";
import { MaterialModule } from "../material/material.module";
import { NgxGaugeModule } from 'ngx-gauge';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { UtilityReportsComponent } from "./../reports/utility-reports/utility-reports.component";
import { SharedModule } from "../shared/modules/shared.module";
import { ProductComponent } from "./product/product.component";
import { MachineComponent } from "./machine/machine.component";
import { AlarmComponent } from "./alarm/alarm.component";
import { PdfModule } from "./shared/pdf/pdf.module";
import {MachineComparisonComponent} from "./machine-comparison/machine-comparison.component";
import {PlantDashboardComponent} from "./plant-dashboard/plant-dashboard.component";
import {PlantToPlantComparisonComponent} from "./plant-to-plant-comparison/plant-to-plant-comparison.component";
import {PrintComponent} from "./print/print.component";
import { ReportviewComponent } from './reportview/reportview.component';
import {ConfigurationService} from '../configuration/configuration.service';
import { OeeReportComponent } from './oee-report/oee-report.component';
import { NewPdfService } from "./shared/new-pdf/new-pdf.service";
import { NewPdfModule } from "./shared/new-pdf/new-pdf.module";
import { MachineMaintenanceComponent } from './machine-maintenance/machine-maintenance/machine-maintenance.component';
import { ViewMaintenanceComponent } from './machine-maintenance/view-maintenance/view-maintenance.component';
import { MachineMaintenanceDialogComponent } from './machine-maintenance/machine-maintenance/machine-maintenance-dialog/machine-maintenance-dialog.component';

const reportRoutes: Routes = [
  {
    path: "energyReport",
    component: EnergyReportsComponent
  },
  {
    path: "utilityReport",
    component: UtilityReportsComponent
  },
  {
    path: "productReport",
    component: ProductComponent
  },
  {
    path: "machineStatusReport",
    component: MachineComponent
  },
  {
    path: "alarmReport",
    component: AlarmComponent
  },
  {
    path:"machineComparisonReport",
    component:MachineComparisonComponent
  },
  {
    path:"plantComparisonReport",
    component:PlantToPlantComparisonComponent
  },
  {
    path:"plantReport",
    component:PlantDashboardComponent
  },
  {
    path:"reportView",
    component:ReportviewComponent
  },
  {
    path:"oeeReport",
    component:OeeReportComponent
  },
   {
    path:"machine-maintenance",
    component:MachineMaintenanceComponent
   },
   {
    path:"maintenance",
    component:ViewMaintenanceComponent
   }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(reportRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    PdfModule,NewPdfModule,
    NgxGaugeModule,
    SharedComponentModule
  ],
  exports: [RouterModule],
  declarations: [
    EnergyReportsComponent,
    //ReportFormComponent,
    UtilityReportsComponent,
    ProductComponent,
    MachineComponent,
    AlarmComponent,
    MachineComparisonComponent,
    PlantDashboardComponent,
    PlantToPlantComparisonComponent,
    PrintComponent,
    ReportviewComponent,
    OeeReportComponent,
    MachineMaintenanceComponent,
    ViewMaintenanceComponent,
    MachineMaintenanceDialogComponent
  ],
  entryComponents: [MachineMaintenanceDialogComponent],
  providers: [ReportsService,ConfigurationService,NewPdfService]
})
export class ReportsModule {}
