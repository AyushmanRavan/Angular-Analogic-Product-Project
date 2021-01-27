import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output
} from "@angular/core";
import { MaterialModule } from "../../material/material.module";
import { PipesModule } from "../../shared/pipes/pipe.module";
import { SelectionService } from "../selection/selection.service";

@Component({
  selector: "summary-highlight",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.scss"]
})
export class SummaryComponent implements OnInit {
  
  @Input() type: string;
  @Input() machineID: number;
  @Input() entity: string;

  @Input() data: {};
  @Input() totalsecond: string;
  @Input() color: string = "#3e6ceb";

  @Output()
  cardClick = new EventEmitter();
  blocks: any[] = [];
  summary;
  breakpoint;

  constructor(private selection: SelectionService) { }

  ngOnInit() {
    if (this.entity.toUpperCase() === "ENERGY") {
      this.render(this.data);
    }
    else {
      this.selection.getSummary(this.machineID).subscribe(data => {
        this.render(data);
      });
    }
  }
  goTo(text: string) {

    this.cardClick.emit(text);
  }

  private render(data) {

    if (this.type == "card") {

      this.summary = data;
    } else {
      this.blocks = [];
      let { totalAlarms } = data;
      switch (this.entity) {
        case "production":
          const {
            totalProduction,
            totalGoodProduction,
            totalRejectProduction,
            perdayProductionAverage
          } = data;
          this.blocks.push(
            { label: `Total Products`, value: `${this.format(totalProduction)} pkts` },
            { label: `Good Products`, value: `${this.format(totalGoodProduction)} pkts` },
            { label: `Rejected Products`, value: `${this.format(totalRejectProduction)} pkts` },
            { label: `Avg. / Hour`, value: `${this.format(perdayProductionAverage)} pkts` }
          );
          break;

        case "alarm":

          this.blocks.push(
            { label: `Total Alarms`, value: `${this.format(totalAlarms)}` }
          );
          break;

        case "alarm-strip":

          this.blocks.push(
            { label: `Total Alarms`, value: `${this.format(totalAlarms)}` }
          );
          this.blocks.push(
            { label: `Total Time`, value: this.totalsecond }
          );

          break;

        case "machine":
          const {
            machineProductionTime,
            machineDownTime,
            machineIdleTime,
            noOfTimeMachineStopages,
            status
          } = data;
          this.blocks.push(
            { label: `Running`, value: `${machineProductionTime}` },
            { label: `Idle`, value: `${machineIdleTime}` },
            { label: `Stopped`, value: `${machineDownTime}` },
            { label: `Number of Stoppage`, value: `${this.format(noOfTimeMachineStopages)}` }
          );
          break;

        case "energy":
          const { totalConsumed } = data;
          this.blocks.push(
            { label: `Total Energy Consumed`, value: `${this.format(totalConsumed)}  kWh` }
          );
          break;
      }
    }
  }

  private format(number: string) {
    return parseInt(number).toLocaleString("en");
  }
}

@NgModule({
  imports: [CommonModule, MaterialModule, PipesModule],
  declarations: [SummaryComponent],
  providers: [SelectionService],
  exports: [SummaryComponent]
})
export class SummaryModule { }
