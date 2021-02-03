import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { ErrorModule } from "../components/error/error.module";
import { MaterialModule } from "../material/material.module";
import { SpinnerModule } from "../components/spinner/spinner.module";
import { AlarmComponent } from "./alarm/alarm.component";
import { DialogComponent } from "./alarm/dialog/dialog.component";
import { ConfigurationService } from "./configuration.service";
import { UserComponent } from "./user/user.component";
import { ParamGroupViewComponent } from "./Parameter-Configuration/param-group-view/param-group-view.component";
import { ParamViewComponent } from "./Parameter-Configuration/param-view/param-view.component";
// import { UserDialogComponent } from "./user/dialog/dialog.component";
import { ParamGroupAddComponent } from "./Parameter-Configuration/param-group-view/param-group-add/param-group-add.component";
import { ParamViewAddComponent } from "./Parameter-Configuration/param-view/param-view-add/param-view-add.component";
import { DepartmentComponent } from './Machine-Configuration/department/department.component';
import { DeptDialogComponent } from './Machine-Configuration/department/dept-dialog/dept-dialog.component';
import { PlantComponent } from './Machine-Configuration/plant/plant.component';
import { PlantDialogComponent } from './Machine-Configuration/plant/plant-dialog/plant-dialog.component';
import { AssemblyComponent } from './Machine-Configuration/assembly/assembly.component';
import { AssemblyDialogComponent } from './Machine-Configuration/assembly/assembly-dialog/assembly-dialog.component';
import { MachineComponent } from './Machine-Configuration/machine/machine.component';
import { MachineDialogComponent } from './Machine-Configuration/machine/machine-dialog/machine-dialog.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { ShiftsDialogComponent } from './shifts/shifts-dialog/shifts-dialog.component';
import { EmailComponent } from './email/email.component';
import { EmailDialogComponent } from './email/email-dialog/email-dialog.component';
import { SmsComponent } from './sms/sms.component';
import { SmsDialogComponent } from './sms/sms-dialog/sms-dialog.component';
import { AssociatedMachineComponent } from './associated-machine/associated-machine.component';
import { AssociatedMachineDialogComponent } from './associated-machine/associated-machine-dialog/associated-machine-dialog.component';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './Report-Configuration/chart/chart.component';
import { ChartDialogComponent } from './Report-Configuration/chart/chart-dialog/chart-dialog.component';
import { ReportComponent } from './Report-Configuration/report/report.component';
import { ReportDialogComponent } from './Report-Configuration/report/report-dialog/report-dialog.component';
import { ReportTableComponent } from './Report-Configuration/report-table/report-table.component';
import { ReportTableDialogComponent } from './Report-Configuration/report-table/report-table-dialog/report-table-dialog.component';
import { HighlightComponent } from './Report-Configuration/highlight/highlight.component';
import { HighlightDialogComponent } from './Report-Configuration/highlight/highlight-dialog/highlight-dialog.component';
import { OperatorMonitoringComponent } from './operator-monitoring/operator-monitoring.component';
import { OperatorMonitoringDialogComponent } from './operator-monitoring/operator-monitoring-dialog/operator-monitoring-dialog.component';
import { TimeSlotComponent } from './time-slot/time-slot.component';
import { TimeSlotDialogComponent } from './time-slot/time-slot-dialog/time-slot-dialog.component';
import { ConfigFilterFormComponent } from './config-filter-form/config-filter-form.component';

import { PdfConfigComponent } from './pdf-config/pdf-config.component';
import { PdfDialogComponent } from './pdf-config/pdf-dialog/pdf-dialog.component';
import { PipesModule } from "../shared/pipes/pipe.module";
import { PasswordPolicyComponent } from './password-policy/password-policy.component';
import { PasswordPolicyDialogComponent } from './password-policy/password-policy-dialog/password-policy-dialog.component';
import { MachineParameterConfigComponent } from './machine-parameter-config/machine-parameter-config.component';
import { MachineParameterConfigDialogComponent } from './machine-parameter-config/machine-parameter-config-dialog/machine-parameter-config-dialog.component';
import { MatPaginatorModule } from "@angular/material/paginator";


@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    ErrorModule,
    FormsModule,
    MaterialModule, 
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    SpinnerModule,
    ChartsModule,
    MatPaginatorModule,
    PipesModule
  ],
  declarations: [
    AlarmComponent,
    DialogComponent,
    UserComponent,
    ParamGroupViewComponent,
    ParamViewComponent,
    // UserDialogComponent,
    ParamGroupAddComponent,
    ParamViewAddComponent,
    DepartmentComponent,
    DeptDialogComponent,
    PlantComponent,
    PlantDialogComponent,
    AssemblyComponent,
    AssemblyDialogComponent,
    MachineComponent,
    MachineDialogComponent,
    ShiftsComponent,
    ShiftsDialogComponent,
    EmailComponent,
    EmailDialogComponent,
    SmsComponent,
    SmsDialogComponent,
    AssociatedMachineComponent,
    AssociatedMachineDialogComponent,
    ChartComponent,
    ChartDialogComponent,
    ReportComponent,
    ReportDialogComponent,
    ReportTableComponent,
    ReportTableDialogComponent,
    HighlightComponent,
    HighlightDialogComponent,
    OperatorMonitoringComponent,
    OperatorMonitoringDialogComponent,
    TimeSlotComponent,
    TimeSlotDialogComponent,
    ConfigFilterFormComponent,
    PdfConfigComponent,
    PdfDialogComponent,
    PasswordPolicyComponent,
    PasswordPolicyDialogComponent,
    MachineParameterConfigComponent,
    MachineParameterConfigDialogComponent
  ],
  entryComponents: [
    DialogComponent,
    // UserDialogComponent,
    ParamGroupAddComponent,
    ParamViewAddComponent,
    DeptDialogComponent,
    PlantDialogComponent,
    AssemblyDialogComponent,
    MachineDialogComponent,
    ShiftsDialogComponent,
    EmailDialogComponent,
    SmsDialogComponent,
    AssociatedMachineDialogComponent,
    ChartDialogComponent,
    ReportDialogComponent,
    ReportTableDialogComponent,
    HighlightDialogComponent,
    OperatorMonitoringDialogComponent,
    TimeSlotDialogComponent,
    PdfDialogComponent,
    PasswordPolicyDialogComponent,
    MachineParameterConfigDialogComponent
  ],
  providers: [ConfigurationService]
})
export class ConfigurationModule { }
