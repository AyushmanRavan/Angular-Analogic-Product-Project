import {  Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator,  MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { ReportsService } from "./../../reports/reports.service";
@Component({
  selector: 'app-oee-report',
  templateUrl: './oee-report.component.html',
  styleUrls: ['./oee-report.component.scss']
})
export class OeeReportComponent implements OnInit {
  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  shift: any;
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  data: any[] = [];
  loadedSpinner: boolean = true;
  plantOptions: any[];
  plantName: number;
  defaultValue: number;
  displayedColumns = ["start_time", "end_time","expectedProduction","good_part", "bad_part", "overallPercentage","productionPercentage","availablityPercentage", "qualityPercentage", "on_time",];
  datasetLength: number;
  dataSource = new MatTableDataSource<any>();
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  highlights: string;
  oeeType: any;

  //For Guage Chart
  gaugeType = 'semi';
  gaugeAppendText = '%';
  gaugemin = 0;
  gaugemax = 100;
  gaugecap = 'round';
  gaugethick = 15;
  thresholdConfig = {
    '0': { color: 'red' },
    '50': { color: 'orange' },
    '80': { color: 'green' }
  };
  oeeGuageChartData;
  guageName = ['OEE','Productivity','Availablity','Quality']
  ChartArray: any[] = [];
  guageValue: any[] = [];

  constructor(
    private error: GlobalErrorHandler,
    private oee: ReportsService, private _intl: MatPaginatorIntl
  ) { }

  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Record per Page";
    // this.dataSource.paginator = this.paginator;
  }

  onSelect(e) {
    this.reportVal = { ...e.values, type: "oee" };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue["plant"];
    this.department = e.reportValue["department"];
    this.assembly = e.reportValue["assembly"];
    this.machineId = e.reportValue["machine"];
    this.from = this.oee.formatDateOee(e.reportValue["from"]);
    this.to = this.oee.formatDateOee(e.reportValue["to"]);
    this.oeeType = e.reportValue["interval"];
    this.shift = e.reportValue["shift"];

    this.OeeDetails(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.oeeType,
      this.shift
    );
  }

  OeeDetails(plant, department, assembly, machineId, from, to, oeeType, shift) {
    this.oee.getOeeReport(
      plant,
      department,
      assembly,
      machineId,
      from,
      to,
      0,
      0
    ).subscribe(data => {
      
      this.setoeeGuageChartData(data);
    }, err => this.handleError(err));

    this.oee.getOeeTableReport(
      plant,
      department,
      assembly,
      machineId,
      from,
      to,
      this.oeeType,
      shift,
      0, 0
    )
      .subscribe(data => { this.pdfReady = false; this.setData(data) }, err => this.handleError(err));

  }
  private setoeeGuageChartData(data) {
    this.oeeGuageChartData = data;
    if (data != null) {
      for (let key of this.oeeGuageChartData) {
        if (Number(key.value) > 100) {
          key.value = 100.0;
        } else {
          key.value = parseInt(key.value);
        }
      }
    }
  }
  private setData(data) {
    if (data != null) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      let cols = [];
      cols = [
        'actual_ppm',
        'machine_name',
        'mtbf',
        'mttr',
        'ppm',
        'production',
        'total_production',
        'shiftArray',
        'type',
        'operator_name'
      ];
      data = this.oee.filterMachineDataForComparisionPdf(data, cols);
    
      this.pdfData = data;
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
    this.oee.throwError(err);
  }

  downloadCanvas(arc) {
    if (this.ChartArray.length != 0) {
      while (this.ChartArray.length > 0) {
        this.ChartArray.pop();
      }
    } //empty
    var canvas = document.getElementsByTagName('ngx-gauge');
    for (let i = 0; i < canvas.length; i++) {
      var imgData = document.getElementsByTagName('canvas')[i].toDataURL('image/png');
      this.ChartArray.push(imgData);
    }
    for (let oee of this.oeeGuageChartData) {
      this.guageValue.push(oee.value.toString());
    }
  }
}