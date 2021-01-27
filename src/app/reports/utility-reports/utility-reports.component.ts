import { Component, AfterViewInit, ViewChild, OnInit } from "@angular/core";

import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";

import { ReportsService } from "../reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";

@Component({
  selector: "app-utility-reports",
  templateUrl: "./utility-reports.component.html",
  styleUrls: ["./utility-reports.component.scss"]
})
export class UtilityReportsComponent implements OnInit {
  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  data = new MatTableDataSource<any>();
  subscriber: Subscription;
  datasetLength: number;
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;


  pdfDataSource: any[] = [];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private error: GlobalErrorHandler, private rs: ReportsService, private _intl: MatPaginatorIntl) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  onSelect(event) {
    this.reportVal = { ...event.values, type: "utility" };
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
    this.pdfReady = true;
    this.rs.getUtilityReport(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval, 0, 0).subscribe(data => {
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
        this.setData(data);
      }, err => this.handleError(err));
  }

  private setData(data) {
    if (data != null) {
      let tempData = this.rs.prioritizeColumns(data);
      this.data = new MatTableDataSource<any>(tempData);
      this.data.paginator = this.paginator;
      // if (this.paginator.pageIndex < 1 && this.paginator.pageSize == 10)
      for (let key in tempData[0]) {
        this.displayedColumns.push(key);
        this.columnsToDisplay.push(key);
      }



      let cols1 = [];
      cols1 = [
        'Leaving_Evaporator_Liquid',
        'Leaving_condenser_liquid',
        'Enter_Evaporator_Liquid',
        'Enter_Condenser_Liquid',
      ];
      if (data) this.datasetLength = data.length;
      this.pdfDataSource = this.rs.filterMachineDataForComparisionPdf(data, cols1);
      this.pdfData = this.rs.prioritizeColumns(this.pdfDataSource)
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