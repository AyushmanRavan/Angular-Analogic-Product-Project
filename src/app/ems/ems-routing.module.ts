import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS, ComponentFactory, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmsComponent } from './ems.component';

const emsRoutes: Routes = [
    {
        path: "",
        component: EmsComponent,
        children: [
            {
                path: "",
                loadChildren: './dashboard/pcc/pcc.module#PccModule'
            },
            {
                path: 'mcc',
                loadChildren: './dashboard/mcc/mcc.module#MccModule'
            },
            {
                path: 'pcc',
                loadChildren: './dashboard/pcc/pcc.module#PccModule'
            },
            {
                path: 'feeder',
                loadChildren: './dashboard/feeder/feeder.module#FeederModule'
            },
            {
                path: 'machinestatus',
                loadChildren: './dashboard/machine-status/machine-status.module#MachineStatusModule'
            },
            {
                path: 'monitoringparams',
                loadChildren: './dashboard/ems-monitoring-param/ems-monitoring-param.module#EmsMonitoringParamModule'
            },
            {
                path: 'mcc-report',
                loadChildren: './reports/mcc-report/mcc-report.module#MccReportModule'

            },
            {
                path: 'pcc-report',
                loadChildren: './reports/pcc-report/pcc-report.module#PccReportModule'
            },
            {
                path: 'feeder-report',
                loadChildren: './reports/feeder-report/feeder-report.module#FeederReportModule'
            },
            {
                path: 'machine-comparison-report', 
                loadChildren: './reports/machine-comparison-report/machine-comparison-report.module#MachineComparisonReportModule'
            },
            {
                path: 'machine-status-report',
                loadChildren: './reports/machine-report/machine-report.module#MachineReportModule'
            },
            {
                path: "config",
                loadChildren: "./../configuration/configuration.module#ConfigurationModule"
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(emsRoutes)],
    exports: [RouterModule]
})
export class EmsRoutingModule { }
