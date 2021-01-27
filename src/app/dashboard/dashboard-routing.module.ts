import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DefaultComponent } from "./default/default.component";
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: DefaultComponent
      },
      {
        path: "products",
        loadChildren: "./../product/product.module#ProductModule"
      },

      {
        path: "alarms",
        loadChildren: "./../alarm/alarm.module#AlarmModule"
      },
      {
        path: "machine",
        loadChildren: "./../machine/machine.module#MachineModule"
      },
      {
        path: "energy",
        loadChildren: "./../energy-dashboard/energy-dashboard.module#EnergyDashboardModule"
      },

      {
        path: "parameter-monitoring",
        loadChildren: "./../parameter-monitoring/parameter-monitoring.module#ParameterMonitoringModule"
      },
      {
        path: "oee",
        loadChildren: "./../oee/oee.module#OeeModule"
      },
      {
        path: 'utility',
        loadChildren: './../utility/utility.module#UtilityModule'
      },
      {
        path: "report",
        loadChildren: "./../reports/reports.module#ReportsModule"
      },
      {
        path: "config",
        loadChildren: "./../configuration/configuration.module#ConfigurationModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
