import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {  MatPaginatorIntl } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { DATA } from "../core/data.enum";
import { StorageServiceService } from "../core/services/auth/storage-service.service";
import { AlarmService } from "./alarm.service";

@Component({
  selector: "app-alarm",
  templateUrl: "./alarm.component.html",
  styleUrls: ["./alarm.component.scss"]
})
export class AlarmComponent implements OnInit, OnDestroy {
  chartColors: Array<any> = [];
  chartData: any[];
  chartOptions: any = {};
  displayedColumns = [];
  empty: boolean = true;
  errMessage: string;
  loaded: boolean;
  machine;
  subscriber: Subscription;
  tableData;
  machineID: number;

  constructor(private storageServiceService: StorageServiceService, private alarm: AlarmService, private _intl: MatPaginatorIntl) {
    this.setupChart();
    this.displayedColumns = this.alarm.getTableColumns();
  }

  ngOnInit() { this.storageServiceService.setStorageItem(DATA.LAST_ACTION, Date.now().toString()); }

  ngOnDestroy() {
    if (this.subscriber) this.subscriber.unsubscribe();
  }

  onSelect(e) {
    this.loaded = false;
    this.empty = false;
    this.machineID = e.machineID;
    this.getProductAlarmDetails(e.machineID);
  }

  private getProductAlarmDetails(name: number) {
    if (undefined !== name) {
      this.subscriber = this.alarm
        .getProductAlarmDetails(name)
        .subscribe(

          data => (this.tableData = this.alarm.getTableData(data)),
          err => this.handleError(err)
        );

      this.subscriber = this.alarm
        .getProductAlarmCount(name)
        .subscribe(
          data => this.setChartData(data),
          err => this.handleError(err)
        );
    } else this.handleError("");
  }

  private handleError(err) {
    this.reset();
    this.empty = true;
    this.errMessage = this.alarm.getErrorMessage(0);
    this.alarm.throwError(err);
  }

  private setupChart() {
    const chart = this.alarm.getChartOptions();
    this.chartOptions = chart.options;
    this.chartColors = chart.colors;
  }

  private setChartData(data) {
    const { chart, empty, errMessage } = this.alarm.getChartData(data);
    this.empty = empty;
    this.chartData = chart;
    this.errMessage = errMessage;
    this.reset();
  }

  private reset() {
    this.loaded = true;
  }
}
