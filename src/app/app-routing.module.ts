import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  { path: "", redirectTo: "login", pathMatch: "full" },

  { path: 'homepage', loadChildren: () => import('./homepage/homepage.module').then(homepage => homepage.HomepageModule) },

  { path: 'machinedetail', loadChildren: () => import('./machine-details/machine-details.module').then(machinedetail => machinedetail.MachineDetailsModule) },

  { path: 'ems', loadChildren: () => import('./ems/ems.module').then(ems => ems.EmsModule) },

  { path: 'login', loadChildren: () => import('./components/login/login.module').then(login => login.LoginModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(dashboard => dashboard.DashboardModule) },

  { path: "**", redirectTo: "homepage" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
