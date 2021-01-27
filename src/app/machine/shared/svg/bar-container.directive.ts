import {
  Directive,
  DoCheck,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";

@Directive({
  selector: "[barContainer]"
})
export class BarContainerDirective implements DoCheck {
  @Output() resize = new EventEmitter<number>();
  private width: number;

  constructor(private _element: ElementRef) {}

  ngDoCheck() {
    const w = this._element.nativeElement.offsetWidth;
    if (w !== this.width) {
      this.width = w;
      this.resize.emit(this.width);
    }
  }
}
