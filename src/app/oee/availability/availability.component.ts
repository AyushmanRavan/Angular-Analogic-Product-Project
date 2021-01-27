import * as moment from "moment";
import { Component, OnInit } from "@angular/core";
import { OeeService } from "./../oee.service";

import { ActivatedRoute, Params } from "@angular/router";
import { Availability, Availability1 } from "./availability";

@Component({
  selector: "app-availability",
  templateUrl: "./availability.component.html",
  styleUrls: ["./availability.component.scss"]
})
export class AvailabilityComponent implements OnInit {
  machineID: any;
  pieChartData: Availability;
  pieChartData1: Availability1;
  TimePieChartData: any;
  PlanUnplanChartData: any;
  labels: any;
  empty: boolean = true;
  loaded: boolean = true;
  loadedSpinner: boolean = true;
  Errormsg: boolean;
  errMessage: string;
  plan: number;
  unplan: number;
  totalplanunplan: number;
  planAngle: number;
  unplanAngle: number;
  onTime: number;
  OffTime: number;
  IdleTime: number;
  total;
  number;
  onTimeAngle: number;
  offTimeAngle: number;
  idleTimeAngle: number;


  hours = 0;
  minutes = 0;
  seconds = 0;
  Tot: any;
  time1: any;
  time2: any;
  time3: any;


  constructor(
    private route: ActivatedRoute,
    private availabilityservice: OeeService
  ) { }

  ngOnInit() {
    this.machineID = this.route.snapshot.paramMap.get("id");
    this.empty = true;
    this.loaded = true;
    this.loadedSpinner = true;
    this.availabilityservice
      .getAvailabilityPieData1(this.machineID)
      .subscribe((data: Availability | any) => {
        this.pieChartData = data;
        if (data != null) {
          this.onTime = data.onTimeInMinutes,
          this.OffTime = data.offTimeInMinutes,
          this.IdleTime = data.idleTimeInMinutes;
          this.loaded = false;
          this.Errormsg = true;
          this.loadedSpinner = false;
          this.empty = true;
          this.TimePieChartData = this.availabilityservice.getChartDataAvailability(data);
        }
        else {
          this.empty = false;
          this.loadedSpinner = false;
          this.loaded = true;
          this.Errormsg = false;
          this.errMessage = this.availabilityservice.getErrorMessage(1);
        }

      });

    this.availabilityservice
      .getAvailabilityPieData2(this.machineID)
      .subscribe((data: Availability1 | any) => {
        this.plan = data.planedBreaks,
          this.unplan = data.unPlanedBreaks;
        this.PlanUnplanChartData = this.availabilityservice.getChartDataPlanUnplan(data);
      });
  }

  // chart option

  public pieChartLabels: string[] = ["onTime", "offTime", "idleTime"];
  public pieChartLabels1: string[] = ["planned", "unplanned"];
  public piechartColor: Array<any> = [
    {
      backgroundColor: ["#5cb85c", "#d9534f", "#ffca28"]
    }
  ];
  public piechartColor1: Array<any> = [
    {
      backgroundColor: ["#5cb85c", "#d9534f", "#ffca28"]
    }
  ];
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const i = tooltipItem.index;
          const ds = tooltipItem.datasetIndex;
          var m = data.datasets[ds].data[i] % 60;

          var h = (data.datasets[ds].data[i] - m) / 60;
          var HHMM = Math.trunc(h).toString() + ":" + (m < 10 ? "0" : "") + Math.trunc(m).toString();

          return `${data.labels[i]} ${HHMM} (HH:MM)`;
        }
      }


    }
  };

  chartOptions1 = {
    responsive: true,
    maintainAspectRatio: false,

    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const i = tooltipItem.index;
          const ds = tooltipItem.datasetIndex;
          var tot = data.datasets[ds].data[i] / 60;
          var h = tot / 60;

          var m = (tot % 60) / 60;

          var HHMM = Math.trunc(h).toString() + ":" + (m < 10 ? "0" : "") + Math.trunc(m).toString()

          return `${data.labels[i]} ${HHMM} (HH:MM)`;
        }
      }
    }
  }
}

