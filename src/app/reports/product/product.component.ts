
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {  Component, OnInit, ViewChild } from "@angular/core";
import { ReportsService } from "./../../reports/reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html", 
  styleUrls: ["./product.component.scss"]
})
export class ProductComponent implements OnInit {
  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  datasetLength: number;
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  data: any[] = [];
  plantOptions: any[];
  plantName: number;
  defaultValue: number;
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;

  highlightForTable: string;

  displayedColumns: string[] = [
    "startDate",
    "endDate",
    "perHrsTotalProduction",
    "perHrsGoodProduction",
    "perHrsRejectProduction"
  ];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private error: GlobalErrorHandler,
    private product: ReportsService,
    private _intl: MatPaginatorIntl
  ) { }


  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Record per Page";
    // this.dataSource.paginator = this.paginator;
  }

  onSelect(e) {
    this.reportVal = { ...e.values, type: "production" };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue["plant"];
    this.department = e.reportValue["department"];
    this.assembly = e.reportValue["assembly"];
    this.machineId = e.reportValue["machine"];
    this.from = this.product.formatDate(e.reportValue["from"]);
    this.to = this.product.formatDate(e.reportValue["to"]);
    this.interval = e.reportValue["interval"];
    this.getProductionDetails(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval
    );
  }

  getProductionDetails(
    plant,
    department,
    assembly,
    machineId,
    from,
    to,
    interval
  ) {
    this.product.getProductionReport(
            plant,
            department,
            assembly,
            machineId,
            from,
            to,
            interval,
            0, 0
          ).subscribe(data => { this.pdfReady = false; this.setData(data) }, err => this.handleError(err));
  }

  private setData(data: Product[]) {
    if (data != null) {
  
      this.dataSource = new MatTableDataSource<Product>(data);
      this.dataSource.paginator = this.paginator;
      // for PDF
      this.highlightForTable = this.getProductionHighlight(data, this.from, this.to);
      let cols1 = [];
      cols1 = [
        'averagePerHrsProduction'
      ];
      this.pdfData = this.product.filterMachineDataForComparisionPdf(data, cols1);
      this.pdfReady = true;

      this.loaded = false;
      this.loadedspinner = false;
    } else {
      this.loadedspinner = false;
      this.Errormsg = false;
      this.errMessage = this.error.getErrorMessage(1);
    }
  }


  getProductionHighlight = (data: any[], from, to): string => {
    let msg, tp, tgp, trp, avg, diff;
    diff = Math.abs(moment(from).diff(moment(to), 'days'));
    tp = this.product.getSum(data, 'perHrsTotalProduction');
    tgp = this.product.getSum(data, 'perHrsGoodProduction').toLocaleString('en');
    trp = this.product.getSum(data, 'perHrsRejectProduction').toLocaleString('en');
    diff = diff == 0 ? 1 : diff;
    avg = (tp / diff).toLocaleString('en');
    return `Total : ${tp.toLocaleString('en')} (pkts)  |  Good :  ${tgp} (pkts)  |  Rejection : ${trp} (pkts)  |  Avg. Prod. : ${avg} (pkts)`;
  };

  private handleError(err, id = 0) {
    this.loaded = true;
    this.loadedspinner = false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.product.throwError(err);
  }


}

export interface Product {
  startDate?: string;
  endDate?: string;
  perHrsTotalProduction: number;
  perHrsGoodProduction: number;
  perHrsRejectProduction: number;
}
