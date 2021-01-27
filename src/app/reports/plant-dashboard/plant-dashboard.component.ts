
import { Subscription } from "rxjs";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import * as moment from "moment";
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatPaginatorIntl } from '@angular/material';
import { ReportsService } from "../reports.service";
@Component({
  selector: "app-plant-dashboard",
  templateUrl: "./plant-dashboard.component.html",
  styleUrls: ["./plant-dashboard.component.scss"]
})
export class PlantDashboardComponent implements OnInit {

  fromStartAt;
  toStartAt;
  highlight: string;
  pdfDataSource: any[] = [];

  pdfData: any[] = [];
  pdfReady: boolean;
  reportVal: any;

  max: Date = new Date();
  min: Date = new Date();

  plantOptions = [];
  plantDashboardReport: FormGroup;
  from: string;
  to: string;
  plants: string;

  loaded: boolean = true;
  spinerLoaded: boolean = false;
  Errormsg: boolean = false;
  errMessage: string;
  subscriber: Subscription;

  datasetLength: number = 10;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "plantName",
    "machineName", "totalGoodProduction",
    "totalRejectProduction",
    "totalAlarms",
    "energy_machine_wise_count",
    "machineProductionTime",
    "machineIdleTime",
    "machineDownTime",
  ];

  plantDashboardSummaryData: any;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _intl: MatPaginatorIntl,
    private fb: FormBuilder,
    private _report: ReportsService,
    private error: GlobalErrorHandler, private snack: MatSnackBar) {
    this.plantDashboardReport = this.fb.group({
      from: [this._report.getDate(), Validators.required],
      to: ["", Validators.required],
      plant: ['Mumbai', Validators.required],
    });
    this.fromStartAt = this._report.getDate();
    this.toStartAt = this._report.getDate(true);
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";
    this._report.getPlant().subscribe(data => {
      if (data != null) { this.plantOptions = data; }
      else {
        this.snack.open('No plants', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err))
  }

  onGenerate() {
    this.loaded = true;
    this.spinerLoaded = true;
    this.Errormsg = true;
    this.plants = this.plantDashboardReport.get('plant').value;
    this.from = this.formatDate(this.plantDashboardReport.get('from').value);
    this.to = this.formatDate(this.plantDashboardReport.get('to').value);
    let plants = [];
    plants.push(this.plants);
    this.plantDashboardSummary(this.plants); //id to summary
    this.plantDashboardData(plants, this.from, this.to);
  }

  setMinToDate() {
    const { from } = this.plantDashboardReport.value;
    this.min = from;
  }

  private plantDashboardSummary(id) {
    this._report.getPlantDashboardSummary(id).subscribe(data => {
      this.plantDashboardSummaryData = data;
      this.highlight = this._report.getPlantDashboardHighlight(data);
    }, err => this.handleError(err))

  }
  private plantDashboardData(plants, from, to) {
    this._report.getPlantDashboardReport(
      plants,
      from,
      to,
      0, 0
    ).subscribe(data => {
    this.pdfReady = false;
      this.setData(plants, data)
    }, err => this.handleError(err));
  }

  private setData(plants, data: plantDashboard[]) {
    if (data != null) {

      this.dataSource = new MatTableDataSource<plantDashboard>(data);
      this.dataSource.paginator = this.paginator

      let cols1 = [];
      cols1 = [
        'energy_overall_count',
        'keyIndex',
        'noOfTimeMachineStopages',
        'oee',
        'perdayProductionAverage',
        'status',
        'stoppageTime',
        'totalProduction',
      ];

        this.pdfDataSource = this._report.filterMachineDataForComparisionPdf(data, cols1);
        this.pdfData = this.pdfDataSource;
        this.reportVal = { ...this.plantDashboardReport.value, type: "plantsDashboardReport" };
        this.pdfReady = true;

        this.loaded = false;
        this.spinerLoaded = false;
        this.Errormsg = true;
        this.plantDashboardReport.enable();

      } else {
        this.loaded = true;
        this.spinerLoaded = false;
        this.Errormsg = false;
        this.plantDashboardReport.enable();
        this.errMessage = this.error.getErrorMessage(1);
      }
    }
  
  private handleError(err, id = 0) {
    this.errMessage = this._report.getErrorMessage(id);
    this._report.throwError(err);
  }

  formatDate = dt => moment(dt).format('YYYY-MM-DD HH:mm:ss');

}

interface plantDashboard {
  machineName: string;
  machineProductionTime: string;
  machineIdleTime: string;
  stoppageTime: string;
  totalAlarms: number;
  energy_machine_wise_count: number;
  totalGoodProduction: number;
  totalRejectProduction: number;
}