import { NgModule } from "@angular/core";

import { HumanizePipe } from "./humanize.pipe";
import { KeyValuePipe } from './key-value.pipe';

@NgModule({
  declarations: [HumanizePipe, KeyValuePipe],
  exports: [HumanizePipe,KeyValuePipe]
})
export class PipesModule {}
