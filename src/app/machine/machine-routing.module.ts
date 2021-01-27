import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachineComponent } from './machine.component';

// TODO: make service
// function routeOptions(path, comp, title) {
//   return {
//     path: path,
//     component: comp,
//     data: {
//       title: [title],
//       description: ""
//     }
//   };
// }

const machineRoutes: Routes = [
  {
    path: '',
    component: MachineComponent
  },
  {
    path: ':machineName',
    component: MachineComponent
  }
  
 
  // { ...routeOptions("", MachineComponent, "Machine") },
  // { ...routeOptions(":machineName", MachineComponent, "Machine") }
];

@NgModule({
  imports: [RouterModule.forChild(machineRoutes)],
  exports: [RouterModule]
})
export class MachineRoutingModule {}
