import { NgModule } from "@angular/core";
import { ChartsModule } from "ng2-charts";
import { SpinnerModule } from "../../components/spinner/spinner.module";
import { MaterialModule } from "../../material/material.module";
import { SelectionModule } from "../../components/selection/selection.module";
import { SummaryModule } from "../../components/summary/summary.module";
import { ErrorModule } from "../../components/error/error.module";

const sharedModule: any[] = [
  ChartsModule,
  ErrorModule,
  MaterialModule,
  SelectionModule,
  SpinnerModule,
  SummaryModule
];

@NgModule({
  imports: [...sharedModule],
  exports: [...sharedModule]
})
export class SharedModule { }
