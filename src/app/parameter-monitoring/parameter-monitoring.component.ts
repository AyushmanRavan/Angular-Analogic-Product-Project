import { ParameterMonitoringService } from "./../parameter-monitoring/parameter-monitoring.service";
import { omit } from 'lodash';
import { Component, AfterViewInit, ViewChild, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { AutoLogoutService } from './../auto-logout.service';
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";
import { BaseChartDirective } from "ng2-charts/ng2-charts";
import { GlobalErrorHandler } from "../core/services/error-handler";
import { DATA } from "../core/data.enum";
import { StorageServiceService } from "../core/services/auth/storage-service.service";

@Component({
  selector: 'app-parameter-monitoring',
  templateUrl: './parameter-monitoring.component.html',
  styleUrls: ['./parameter-monitoring.component.scss']
})
export class ParameterMonitoringComponent implements OnInit {
  Errormsg: boolean;
  errMessage: string;
  loaded: boolean = true;
  loadedSpinner: boolean = true;
  isParamloading: boolean;
  isPaginatorLoading: boolean;

  param = new FormControl();
  paramList: Array<any> = [];
  defaultValue: Array<any> = [];
  chartLabels: Array<any> = [];
  chartOptions: any;
  chartData: any[];
  Data: any[];
  chartColors: any[];
  paramName: string;

  list: any[] = [];
  datasetLength: number;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  data: MatTableDataSource<any> = new MatTableDataSource<any>();
  array = [];
  summary: any = {
    totalConsumed: 0
  };
  machineID: number;
  TableData: any[];
  @ViewChild("baseChart")
  chart: BaseChartDirective;

  selectedParameter: any[] = [];
  selected: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private error: GlobalErrorHandler,
    private energy: ParameterMonitoringService, private _intl: MatPaginatorIntl,
    private logout: AutoLogoutService,
    private storageServiceService: StorageServiceService
  ) {
    this.setupChart();
  }

  ngOnInit() {
    this.storageServiceService.saveStorage(DATA.LAST_ACTION, Date.now().toString());
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }


  onSelect(e) {
    this.loaded = true;
    this.loadedSpinner = true;
    this.Errormsg = true;
    this.machineID = e.machineID;
    this.getEnergyParamters(e.machineID);
  }

  private getEnergyParamters(machineId: number) {
  this.selectedParameter.length = 0;
  this.paramList.length = 0;
    if (this.paramList.length != 0) {
      while (this.paramList.length > 0) {
        this.paramList.pop();
      }
    } //empty before get param
    if (this.defaultValue.length != 0) {
      while (this.defaultValue.length > 0) {
        this.defaultValue.pop();
      }
    } //empty before get default param

    this.energy.getParameters(machineId).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].param_type == "datetime" || data[i].param_type == "varchar" || data[i].param_type == "bit") {
        } else {
          this.paramName = data[i].param_name;
          if (this.paramName.toUpperCase() != "PRODUCTION_COST") this.paramList.push(data[i]);
        }
      }
      this.defaultValue.push(this.paramList[0]);
      this.selectedParameter.push(this.paramList[0]);
      this.compareParameter(this.paramList, this.selectedParameter);
      this.energy.getEnergyDetails(machineId, this.defaultValue).subscribe(data => { this.setDataChart(data) },err => this.handleError(err));
      this.getTableData(this.selectedParameter);
      this.onChange(this.defaultValue);
    });
  }

  onChange(e) {
    this.isParamloading = true;
    this.energy.getEnergyDetails(this.machineID, e).subscribe(data => this.setDataChart(data));
    this.compareParameter(this.paramList, e);
    this.getTableData(e);
  }

  compareParameter(param1: any, param2: any) {
    return param1 && param2 ? param1.param_name === param2.param_name : param1 === param2;
  }

  private setDataChart(data) {
    if (data.length > 0) {
      this.Data = this.energy.getChartData(data.reverse());
      this.chartData = this.Data;
   
      if (this.chart !== undefined) {
        this.chart.ngOnDestroy();
        this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
      }
      this.isParamloading = false;
      this.loaded = false;
      this.Errormsg = true;
      this.loadedSpinner = false;
    } else {
      this.errMessage = this.error.getErrorMessage(1);
      this.Errormsg = false;
      this.loaded = true;
      this.loadedSpinner = false;
    }
  }

  private setupChart() {
    let chart = this.energy.getChartOptions();
    this.chartLabels = chart.labels;
    this.chartOptions = chart.options;
  }

  private getTableData(paramList) {
    this.energy.getEnergyDetails(this.machineID,paramList).subscribe(data => { this.setTableData(data) });
  }

  setTableData(data) {
  
    let cols = ["production_cost", "StartTime", "EndTime"];
    let TableData;
    if (data != null) {
      this.summary = {
        totalConsumed: this.energy.getTotalConsumed(data)
      };
   
      this.data = new MatTableDataSource<any>(data);
      this.data.paginator = this.paginator;
   
      this.displayedColumns = [];
      this.columnsToDisplay = [];
      for (let key in data[0]) {
        this.displayedColumns.push(key);
        this.columnsToDisplay.push(key);
      }
      // this.loaded = false;
      // this.loadedSpinner = false;
      // this.Errormsg = true;
      this.isPaginatorLoading = false;
      // } else {
      //   this.loadedSpinner = false;
      //   this.Errormsg = false;
      //   this.errMessage = this.error.getErrorMessage(1);
      //   this.loaded = true;
      // }
    }
  }

  private handleError(err, id = 0) {
    this.loaded=true;
    this.loadedSpinner = false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.energy.throwError(err);
  }
}