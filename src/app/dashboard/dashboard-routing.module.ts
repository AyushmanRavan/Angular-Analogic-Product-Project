import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DefaultComponent } from "./default/default.component";
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  {
    path: "", component: DashboardComponent,
    children: [
      { path: "", component: DefaultComponent },
      { path: "products", loadChildren: () => import('./../product/product.module').then(products => products.ProductModule) },
      { path: 'alarms', loadChildren: () => import('./../alarm/alarm.module').then(alarms => alarms.AlarmModule) },
      { path: "machine", loadChildren: () => import('./../machine/machine.module').then(machine => machine.MachineModule) },
      { path: "energy", loadChildren: () => import('./../energy-dashboard/energy-dashboard.module').then(energy => energy.EnergyDashboardModule) },
      { path: "parameter-monitoring", loadChildren: () => import('./../parameter-monitoring/parameter-monitoring.module').then(parameter => parameter.ParameterMonitoringModule) },
      { path: "oee", loadChildren: () => import('./../oee/oee.module').then(oee => oee.OeeModule) },
      { path: 'utility', loadChildren: () => import('./../utility/utility.module').then(utility => utility.UtilityModule) },
      { path: "report", loadChildren: () => import('./../reports/reports.module').then(report => report.ReportsModule) },
      { path: "config", loadChildren: () => import('./../configuration/configuration.module').then(config => config.ConfigurationModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
