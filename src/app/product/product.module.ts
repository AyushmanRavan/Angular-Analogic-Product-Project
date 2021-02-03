import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared/modules/shared.module";
import { ProductRoutingModule } from "./product-routing.module";
import { ProductComponent } from "./product.component";
import { ProductService } from "./product.service";
import { MaterialModule } from "../material/material.module";

@NgModule({
  imports: [
    CommonModule,    
    ProductRoutingModule,
    SharedModule,
    MaterialModule
 
  ],
  declarations: [ProductComponent],
  providers: [ProductService]
})
export class ProductModule {}
