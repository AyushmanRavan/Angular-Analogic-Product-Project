import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MachineDetailsComponent } from "./machine-details.component";
import { DefaultMachineDbComponent } from "./common/default-machine-db/default-machine-db.component"

const machinedetailRoutes: Routes = [
  {
    path: "", component: MachineDetailsComponent,
    children: [
      { path: "", component: DefaultMachineDbComponent },
      { path: "aircompressor", loadChildren: () => import('./dashboard/air-compressor/air-compressor.module').then(aircompressor => aircompressor.AirCompressorModule) },
      { path: "boiler", loadChildren: () => import('./dashboard/boiler/boiler.module').then(boiler => boiler.BoilerModule) },
      { path: "chiller", loadChildren: () => import('./dashboard/chiller/chiller.module').then(chiller => chiller.ChillerModule) },
      { path: "coolingtower", loadChildren: () => import('./dashboard/cooling-tower/cooling-tower.module').then(coolingtower => coolingtower.CoolingTowerModule) },
      { path: "aircompressorreport", loadChildren: () => import('./reports/air-compressor-reports/air-compressor-reports.module').then(aircompressorreport => aircompressorreport.AirCompressorReportsModule) },
      { path: "boilerreport", loadChildren: () => import('./reports/boiler-reports/boiler-reports.module').then(boilerreport => boilerreport.BoilerReportsModule) },
      { path: "chillerreport", loadChildren: () => import('./reports/chiller-reports/chiller-reports.module').then(chillerreport => chillerreport.ChillerReportsModule) },
      { path: "coolingtowerreport", loadChildren: () => import('./reports/cooling-tower-reports/cooling-tower-reports.module').then(coolingtowerreport => coolingtowerreport.CoolingTowerReportsModule) },
      { path: "machinealaram", loadChildren: () => import('./common/alaram-common/alaram-common.module').then(machinealaram => machinealaram.AlaramCommonModule) },
      { path: "machinestatustemp", loadChildren: () => import('../machine/machine.module').then(machinestatustemp => machinestatustemp.MachineModule) },
      { path: "machinestatus", loadChildren: () => import('./common/machine-status/machine-status.module').then(machinestatus => machinestatus.MachineStatusModule) },
      { path: "machinereportalaram", loadChildren: () => import('./common/alarm-report/alarm-report.module').then(machinereportalaram => machinereportalaram.AlarmReportModule) },
      { path: "machinereportstatus", loadChildren: () => import('./common/machine-report/machine-report.module').then(machinereportstatus => machinereportstatus.MachineReportModule) },
      { path: "monitoringparams", loadChildren: () => import('./dashboard/monitoring-param/monitoring-param.module').then(monitoringparams => monitoringparams.MonitoringParamModule) },
      { path: "config", loadChildren: () => import('./../configuration/configuration.module').then(config => config.ConfigurationModule) }
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
