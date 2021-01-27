import { CommonModule } from "@angular/common";
import { Component, Input, NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: "error",
  template: `
    <div fxLayout fxLayout.xs="column" fxLayoutAlign="left">
        <h3 class="subheading-2">{{errMessage}}
        <button mat-icon-button (click)="reload();">
            <mat-icon aria-label="Refresh">refresh</mat-icon>
        </button>
        </h3>
    </div>
    ` 
}) 
export class ErrorComponent {
  @Input("message")
  errMessage: string = "Sorry, Something Went Wrong: Please try again later.";

  constructor() {}

  reload() {
    window.location.reload();
  }
}

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule],
  declarations: [ErrorComponent],
  exports: [ErrorComponent]
})
export class ErrorModule {}
