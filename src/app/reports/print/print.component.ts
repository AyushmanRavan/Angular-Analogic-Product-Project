import { Component, Input } from "@angular/core";

import { LOGO } from "../shared/logo";

/**
 * @author Hardik Pithva
 */
@Component({
  selector: "print-content",
  templateUrl: "./print.component.html",
  styleUrls: ["./print.component.scss"]
})
export class PrintComponent {
  @Input("data") report: any;
  imgUri: string;
  
  constructor() {
    this.imgUri = LOGO;
  }
}
