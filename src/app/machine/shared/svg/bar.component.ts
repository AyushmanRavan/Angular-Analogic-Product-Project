import { Component, OnInit, Input } from "@angular/core";
import { Bar, Xaxis } from ".";

@Component({
  selector: "svg-bar",
  template: `
            <div class='bar-area'>                
                <h2 class="mat-h2 custom-h2"><mat-icon>access_time</mat-icon>&nbsp;{{title}}</h2>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="chart" aria-labelledby="title"
                    width="100%" height="100" role="img">
                    <title id="title">A bar</title>
                    <g class="bar">
                        <rect fill="#FFF" stroke="#DEDEDE" stroke-width="0.65" x="0" y="10" width="100%" height="57" fill-opacity="1"></rect>
                        <rect *ngFor="let item of barData;" matTooltipPosition="above" [matTooltip]="item.label" [attr.fill]="item.color" stroke="#000"
                        stroke-width="0" [attr.x]="item.pos.x" [attr.y]="item.pos.y" [attr.width]="item.value" height="57" stroke-dasharray="none"
                        fill-opacity="1">                     
                        </rect>
                        <line *ngFor="let item of xAxis;" stroke="#DEDEDE" [attr.x1]="item.pos.x" [attr.x2]="item.pos.x" y1="10" y2="68"></line> 
                    </g>
                    <g class="labels x-labels">
                        <text *ngFor="let item of xAxis" [attr.x]="item.pos.x" [attr.y]="item.pos.y">{{item.time}}</text>
                    </g>
                </svg>                
            </div>
        `,
  styleUrls: ["./bar.style.scss"]
})
export class BarComponent implements OnInit {
  @Input("x") xAxis: Xaxis[];
  @Input("data") barData: Bar[] | any = [];
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
