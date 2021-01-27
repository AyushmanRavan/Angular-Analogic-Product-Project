import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// import { ChartsModule } from "ng2-charts";
// import { SpinnerModule } from "../components/spinner/";

// import { MaterialModule } from "../material/material.module";
import { SharedModule } from "../shared/modules/shared.module";
import { AlaramRoutingModule } from "./alarm-routing.module";
import { AlarmComponent } from "./alarm.component";
import { AlarmService } from "./alarm.service";

@NgModule({
  imports: [
    AlaramRoutingModule,
    // ChartsModule,
    CommonModule,
    SharedModule
    // MaterialModule,
    // SpinnerModule
  ],
  declarations: [AlarmComponent],
  providers: [AlarmService]
})
export class AlarmModule {}
