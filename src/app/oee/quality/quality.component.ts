import { OeeService } from "./../oee.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";

import { Quality } from "./quality";

@Component({
  selector: "app-quality",
  templateUrl: "./quality.component.html",
  styleUrls: ["./quality.component.scss"]
})
export class QualityComponent implements OnInit {
  machineID: number;
  machineID1: any;
  barChartOptions: any;
  totalOfBadAndGood: any;
  GoodPartAngle: any;
  BadPartAngle: any;
  totalGoodPart: number;
  totalBadPart: number;


  qualityData: Quality[];

  barChartLabels: number[] = [];
  barChartLegend: boolean = true;
  barChartData: any[];
  barChartData1: any[];
  barChartData2: any[];
  chartColors: Array<any> = [];
  goodPercentage: any;
  badPercentage: any;
  displayedColumns = [];
  datasetLength: number = 0;
  subscriber: Subscription;
  total: number;
  isPaginatorLoading: boolean;

  empty: boolean = true;
  errMessage: string;
  highlight: any;
  loaded: boolean;
  dataSource = new MatTableDataSource<Quality>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _intl: MatPaginatorIntl,
    private route: ActivatedRoute, private qualityservice: OeeService
  ) {
    this.setupChart();
    this.displayedColumns = this.qualityservice.getTableColumnsQuality();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";

    this.route.params.forEach(
      (params: Params) => (this.machineID = params["machineID"])
    );


    this.machineID1 = this.route.snapshot.paramMap.get("id");

    this.qualityservice
      .getQualityDetails(this.machineID, 0, 0)
      .subscribe((data: Quality | any) => {

        this.qualityData = data;

        this.totalGoodPart = this.qualityservice.getGoodPartTotal(this.qualityData);

        this.totalBadPart = this.qualityservice.getBadPartTotal(this.qualityData);

        this.totalOfBadAndGood = this.totalGoodPart + this.totalBadPart;
        this.goodPercentage = (this.totalGoodPart / this.totalOfBadAndGood) * 100;
        this.badPercentage = (this.totalBadPart / this.totalOfBadAndGood) * 100;
      });
    this.loaded = false;
    this.empty = false;
  }

  ngAfterViewInit() {

    this.getQualityDetails(this.machineID);
  }

  private getQualityDetails(machineID: number) {
    if (undefined !== name) {
      this.qualityservice.getQualityDetails(machineID, 0, 0).subscribe(
        data => {
          this.setData(this.qualityservice.sortByQuality(data, "start_time")),
            err => this.handleError(err)
        });
      this.qualityservice.getQualityDetails(machineID, 0, 0).subscribe(
        data => {
          this.setDatachart(this.qualityservice.sortByQuality(data, "start_time")),
            err => this.handleError(err)
        });
    }
  }

  private setData(data: Quality[] | any) {
    if (data.length > 0) {
      this.empty = false;
      this.dataSource = new MatTableDataSource<Quality>(data);
      this.dataSource.paginator = this.paginator;

    } else {
      this.empty = true;
      this.errMessage = this.qualityservice.getErrorMessage(1);
    }
    this.reset();
  }

  private setDatachart(data: Quality[] | any) {
    if (data != null) {
      this.empty = false;
      this.barChartData1 = this.qualityservice.getChartDataQuality1();
      this.barChartData2 = this.qualityservice.getChartDataQuality2();
     this.barChartData = this.qualityservice.getChartDataQuality(data);

    } else {
      this.empty = true;
      this.errMessage = this.qualityservice.getErrorMessage(1);
    }
    this.reset();
  }

  private handleError(err, id = 0) {
    this.reset();
    this.empty = true;
    this.errMessage = this.qualityservice.getErrorMessage(id);
    this.qualityservice.throwError(err);
  }

  private reset() {
    this.loaded = true;
    this.isPaginatorLoading = false;
  }

  private setupChart() {
    const chart = this.qualityservice.getChartOptionsQuality();
    this.barChartOptions = chart.options;
    this.chartColors = chart.colors;
    this.barChartLabels = chart.labels;
  }

  // Pie

  public pieChartLabels: string[] = ["Good Part", "Bad Part"];

  public pieChartData: number[] = [300, 500];
  public piechartColor: Array<any> = [
    { backgroundColor: ["#5cb85c", "#d9534f"] }
  ];

  public pieChartType: string = "pie";

  public pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const i = tooltipItem.index;
          const ds = tooltipItem.datasetIndex;
          return ` ${data.labels[i]} ${data.datasets[ds].data[i]} pkt(s)`;
        }
      }
    }
  };
  public pieChartOptions1 = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const i = tooltipItem.index;
          const ds = tooltipItem.datasetIndex;
          return ` ${data.labels[i]} ${data.datasets[ds].data[i]} %`;
        }
      }
    }
  };
}