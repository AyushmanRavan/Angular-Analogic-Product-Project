import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS, ComponentFactory, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmsComponent } from './ems.component';

const emsRoutes: Routes = [
    {
        path: "", component: EmsComponent,
        children: [
            { path: "", loadChildren: () => import('./dashboard/pcc/pcc.module').then(ems => ems.PccModule) },
            { path: 'mcc', loadChildren: () => import('./dashboard/mcc/mcc.module').then(ems => ems.MccModule) },
            { path: 'pcc', loadChildren: () => import('./dashboard/pcc/pcc.module').then(ems => ems.PccModule) },
            { path: 'feeder', loadChildren: () => import('./dashboard/feeder/feeder.module').then(ems => ems.FeederModule) },
            { path: 'machinestatus', loadChildren: () => import('./dashboard/machine-status/machine-status.module').then(ems => ems.MachineStatusModule) },
            { path: 'monitoringparams', loadChildren: () => import('./dashboard/ems-monitoring-param/ems-monitoring-param.module').then(ems => ems.EmsMonitoringParamModule) },
            { path: 'mcc-report', loadChildren: () => import('./reports/mcc-report/mcc-report.module').then(ems => ems.MccReportModule) },
            { path: 'pcc-report', loadChildren: () => import('./reports/pcc-report/pcc-report.module').then(ems => ems.PccReportModule) },
            { path: 'feeder-report', loadChildren: () => import('./reports/feeder-report/feeder-report.module').then(ems => ems.FeederReportModule) },
            { path: 'machine-comparison-report', loadChildren: () => import('./reports/machine-comparison-report/machine-comparison-report.module').then(ems => ems.MachineComparisonReportModule) },
            { path: 'machine-status-report', loadChildren: () => import('./reports/machine-report/machine-report.module').then(ems => ems.MachineReportModule) },
            { path: "config", loadChildren: () => import('./../configuration/configuration.module').then(ems => ems.ConfigurationModule) }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(emsRoutes)],
    exports: [RouterModule]
})
export class EmsRoutingModule { }
