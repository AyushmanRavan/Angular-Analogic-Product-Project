import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared/modules/shared.module";
import { ProductRoutingModule } from "./product-routing.module";
import { ProductComponent } from "./product.component";
import { ProductService } from "./product.service";

@NgModule({
  imports: [
    CommonModule,    
    ProductRoutingModule,
    SharedModule
  ],
  declarations: [ProductComponent],
  providers: [ProductService]
})
export class ProductModule {}
