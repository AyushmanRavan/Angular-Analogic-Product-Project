import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: 'homepage', loadChildren: () => import('./homepage/homepage.module').then(module => module.HomepageModule) },
  { path: 'machinedetail', loadChildren: () => import('./machine-details/machine-details.module').then(module => module.MachineDetailsModule) },
  { path: 'ems', loadChildren: () => import('./ems/ems.module').then(module => module.EmsModule) },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(module => module.LoginModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule) },
  { path: "**", redirectTo: "homepage" }
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
