import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MachineDetailsComponent } from "./machine-details.component";
import { DefaultMachineDbComponent } from "./common/default-machine-db/default-machine-db.component"

const machinedetailRoutes: Routes = [
  {
    path: "",
    component: MachineDetailsComponent,
    children: [
      {
        path: "",
        component: DefaultMachineDbComponent
      },
      {
        path: "aircompressor",
        loadChildren: "./dashboard/air-compressor/air-compressor.module#AirCompressorModule"
      },
      {
        path: "boiler",
        loadChildren: "./dashboard/boiler/boiler.module#BoilerModule"
      },
      {
        path: "chiller",
        loadChildren: "./dashboard/chiller/chiller.module#ChillerModule"
      },
      {
        path: "coolingtower",
        loadChildren: "./dashboard/cooling-tower/cooling-tower.module#CoolingTowerModule"
      },
      {
        path: "aircompressorreport",
        loadChildren: "./reports/air-compressor-reports/air-compressor-reports.module#AirCompressorReportsModule"
      },
      {
        path: "boilerreport",
        loadChildren: "./reports/boiler-reports/boiler-reports.module#BoilerReportsModule"
      },
      {
        path: "chillerreport",
        loadChildren: "./reports/chiller-reports/chiller-reports.module#ChillerReportsModule"
      },
      {
        path: "coolingtowerreport",
        loadChildren: "./reports/cooling-tower-reports/cooling-tower-reports.module#CoolingTowerReportsModule"
      },
      {
        path: "machinealaram",
        loadChildren: "./common/alaram-common/alaram-common.module#AlaramCommonModule"
      },
      {
        path: "machinestatustemp",
        loadChildren: "../machine/machine.module#MachineModule"
      },
      {
        path: "machinestatus",
        loadChildren: "./common/machine-status/machine-status.module#MachineStatusModule"
      },
      {
        path: "machinereportalaram",
        loadChildren: "./common/alarm-report/alarm-report.module#AlarmReportModule"
      },
      {
        path: "machinereportstatus",
        loadChildren: "./common/machine-report/machine-report.module#MachineReportModule"
      },
      {
        path: "monitoringparams",
        loadChildren: "./dashboard/monitoring-param/monitoring-param.module#MonitoringParamModule"
      },
      {
        path: "config",
        loadChildren: "./../configuration/configuration.module#ConfigurationModule"
      }
      // {
      //   path : "coolingtowerreport",
      //   loadChildren : "./reports/cooling-tower/cooling-tower.module#CoolingTowerModule"
      // }
    ]
  }


];
@NgModule({
  imports: [RouterModule.forChild(machinedetailRoutes)],
  exports: [RouterModule]
})
export class MachineDetailsRoutingModule { }
