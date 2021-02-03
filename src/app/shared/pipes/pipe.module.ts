import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HumanizePipe } from "./humanize.pipe";
import { KeyValuePipe } from './key-value.pipe';

@NgModule({
  declarations: [HumanizePipe, KeyValuePipe],
  imports: [CommonModule],
  exports: [HumanizePipe, KeyValuePipe]
})
export class PipesModule { }
