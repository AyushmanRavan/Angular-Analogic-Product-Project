import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AlarmComponent } from "./alarm/alarm.component";
import { UserComponent } from "./user/user.component";
import { ParamGroupViewComponent } from "./Parameter-Configuration/param-group-view/param-group-view.component";
import { ParamViewComponent } from "./Parameter-Configuration/param-view/param-view.component";
import { DepartmentComponent } from "./Machine-Configuration/department/department.component";
import { PlantComponent } from './Machine-Configuration/plant/plant.component';
import { AssemblyComponent } from './Machine-Configuration/assembly/assembly.component';
import { MachineComponent } from './Machine-Configuration/machine/machine.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { EmailComponent } from './email/email.component';
import { SmsComponent } from './sms/sms.component';
import { AssociatedMachineComponent } from './associated-machine/associated-machine.component';
import { ChartComponent } from './Report-Configuration/chart/chart.component';
import { ReportComponent } from './Report-Configuration/report/report.component';
import { ReportTableComponent } from './Report-Configuration/report-table/report-table.component';
import { HighlightComponent } from './Report-Configuration/highlight/highlight.component';
import { OperatorMonitoringComponent } from './operator-monitoring/operator-monitoring.component';
import { TimeSlotComponent } from './time-slot/time-slot.component';
import { PdfConfigComponent } from './pdf-config/pdf-config.component';
import { PasswordPolicyComponent } from './password-policy/password-policy.component'
import { MachineParameterConfigComponent } from "./machine-parameter-config/machine-parameter-config.component";
const configRoutes: Routes = [
  { path: "alarms", component: AlarmComponent },
  { path: "user", component: UserComponent },
  { path: "password-policy", component: PasswordPolicyComponent },
  { path: "paramView", component: ParamViewComponent },
  { path: "paramGroupView", component: ParamGroupViewComponent },
  { path: "department", component: DepartmentComponent },
  { path: "plant", component: PlantComponent },
  { path: "assembly", component: AssemblyComponent },
  { path: "machine", component: MachineComponent },
  { path: "shifts", component: ShiftsComponent },
  { path: "email", component: EmailComponent },
  { path: "sms", component: SmsComponent },
  { path: "associated-machine", component: AssociatedMachineComponent },
  { path: "report", component: ReportComponent },
  { path: "chart", component: ChartComponent },
  { path: "report-table", component: ReportTableComponent },
  { path: "report-highlight", component: HighlightComponent },
  { path: "operator-monitoring", component: OperatorMonitoringComponent },
  { path: "timeSlot", component: TimeSlotComponent },
  { path: "pdf", component: PdfConfigComponent },
  { path: "machine-parameter-config", component: MachineParameterConfigComponent }
];

@NgModule({
  imports: [RouterModule.forChild(configRoutes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
