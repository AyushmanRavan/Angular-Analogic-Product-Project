import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductComponent } from "./product.component";

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

const productRoutes: Routes = [
  {
    path: "",
    component: ProductComponent
  },
  {
    path: ":machineName",
    component: ProductComponent
  }
  // {
  //   ...routeOptions("", ProductComponent, "Products")
  // },
  // {
  //   ...routeOptions(":machineName", ProductComponent, "Products")
  // }
];
@NgModule({
  imports: [RouterModule.forChild(productRoutes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
