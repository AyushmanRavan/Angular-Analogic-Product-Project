import { Component, AfterViewInit, ViewChild, OnInit } from "@angular/core";

import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { Subscription } from "rxjs";
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";
import { ReportsService } from "../reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { sumBy } from 'lodash';
@Component({
  selector: "app-energy-reports",
  templateUrl: "./energy-reports.component.html",
  styleUrls: ["./energy-reports.component.scss"]
})
export class EnergyReportsComponent implements OnInit {
  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  array = [];
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  paramList: Array<any> = [];
  datasetLength: number;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  dataSource = new MatTableDataSource<any>();;
  subscriber: Subscription;
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;
  totalConsumed: number = 0
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  highlightForTable: string;
  constructor(private _intl: MatPaginatorIntl, private error: GlobalErrorHandler, private rs: ReportsService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  onSelect(event: any) {
    this.reportVal = { ...event.values, type: "machineEnergyReport" };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = event.reportValue["plant"];
    this.department = event.reportValue["department"];
    this.assembly = event.reportValue["assembly"];
    this.machineId = event.reportValue["machine"];
    this.from = this.rs.formatDate(event.reportValue["from"]);
    this.to = this.rs.formatDate(event.reportValue["to"]);
    this.interval = event.reportValue["interval"];
    this.getEnergyParameters(this.machineId);
  }


  private getEnergyParameters(machineId: number) {
    this.rs.getParameters(machineId).subscribe(data => {
      if (this.paramList.length != 0) {
        while (this.paramList.length > 0) {
          this.paramList.pop();
        }
      } //empty
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].param_type == "datetime" ||
          data[i].param_type == "varchar"
        ) {
        } else {
          this.paramList.push(data[i]);
        }
      }
      this.getReport(this.paramList);
    }, err => this.handleError(err));
  }

  private getReport(paramList) {
    if (this.array.length != 0) {
      while (this.array.length > 0) {
        this.array.pop();
      }
    } //empty

    for (let i = 0; i < this.paramList.length; i++) {
      this.array.push(this.paramList[i].param_name);
    }

    this.rs.getEnergyReport(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval,
      this.array,
      0, 0
    ).subscribe(data => {
      if (this.displayedColumns.length != 0) {
        while (this.displayedColumns.length > 0) {
          this.displayedColumns.pop();
        }
      } //empty
      if (this.columnsToDisplay.length != 0) {
        while (this.columnsToDisplay.length > 0) {
          this.columnsToDisplay.pop();
        }
      } //empty   
      this.pdfReady = false;
      this.setTableData(data);
    }, err => this.handleError(err));
  }

  setTableData(data) {
    if (data != null) {
      let tempData = this.rs.prioritizeColumns(data);
      this.dataSource = new MatTableDataSource<any>(tempData);
      this.dataSource.paginator = this.paginator;
      for (let key in tempData[0]) {
        this.displayedColumns.push(key);
        this.columnsToDisplay.push(key);
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].kwh != null) {
          this.totalConsumed = this.totalConsumed + parseFloat(data[i].kwh);
        }
      }
      this.highlightForTable = `Total Energy consumed : ${this.totalConsumed} kWh`;
      this.pdfData = this.rs.prioritizeColumns(data);
      this.pdfReady = true;


      this.loaded = false;
      this.loadedspinner = false;
    } else {
      this.loadedspinner = false;
      this.Errormsg = false;
      this.errMessage = this.error.getErrorMessage(1);
    }
  }

  private handleError(err, id = 0) {
    this.loaded = true;
    this.loadedspinner = false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.rs.throwError(err);
  }


}
