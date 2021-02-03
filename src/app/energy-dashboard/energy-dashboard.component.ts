import { Component,  ViewChild, OnInit } from "@angular/core";
import { MatPaginator,  MatPaginatorIntl } from "@angular/material/paginator";
import { GlobalErrorHandler } from "../core/services/error-handler";
import { EnergyDashboardService } from "./../energy-dashboard/energy-dashboard.service";
import { DATA } from '../core/data.enum';
import { StorageServiceService } from '../core/services/auth/storage-service.service';
import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: 'app-energy-dashboard',
  templateUrl: './energy-dashboard.component.html',
  styleUrls: ['./energy-dashboard.component.scss']
})
export class EnergyDashboardComponent implements OnInit {
  Errormsg: boolean;
  errMessage: string;
  loaded: boolean = true;
  loadedSpinner: boolean = true;
  empty: boolean = true;

  paramList: Array<any> = [];
  chartLabels: Array<any> = [];
  chartOptions: any;
  chartData: any[];
  Data: any[];
  chartColors: any[];

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

 

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private error: GlobalErrorHandler,
    private energy: EnergyDashboardService, private _intl: MatPaginatorIntl,
     private storageServiceService: StorageServiceService
  ) { }

  ngOnInit() {
    this.setupChart(); 
    this.storageServiceService.setStorageItem(DATA.LAST_ACTION, Date.now().toString());
    // this._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Record per Page";
    // this.dataSource.paginator = this.paginator;
  }
  
  onSelect(e) {
    this.loaded = true;
    this.loadedSpinner = true;
    this.Errormsg = true;
    this.empty = false;
    this.machineID = e.machineID;
    this.getEnergyParamters(e.machineID);
  }

  private getEnergyParamters(machineId: number) {
    this.energy.getEnergyDetailsForChart(machineId).subscribe(data => { this.setDataChart(data)},err => this.handleError(err));
    this.energy.getEnergyForTable(machineId).subscribe(data => {  this.setTableData(data);},err  => this.handleError(err))   
  }


  private setDataChart(data) {
    if (data.length > 0) {
     this.chartData = this.energy.getChartData(data);
      this.loadedSpinner = false;
      this.loaded = false;
      this.Errormsg = true;
    } else {
      this.errMessage = this.error.getErrorMessage(1);
      this.Errormsg = false;
      this.loaded = true;
      this.loadedSpinner = false;
    }
  }


  setTableData(data) {
      this.data = new MatTableDataSource<any>(data);
      this.data.paginator = this.paginator;
      if (data != null) {
        this.summary = {
          totalConsumed: this.energy.getTotalConsumed(data)
        };

      this.displayedColumns = [];
      this.columnsToDisplay = [];
      for (let key in data[0]) {
         if(key==='kwh' || key==='production_count' || key==='Start Date-Time' || key==='End Date-Time')
        {
          this.displayedColumns.push(key);
          this.columnsToDisplay.push(key);
        }
      }
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

  private handleError(err, id = 0) {
    this.loaded=true;
    this.loadedSpinner = false;
    this.Errormsg = false;
    this.empty = true;
    this.errMessage = this.error.getErrorMessage(id);
    this.energy.throwError(err);
  }

  private setupChart() {
    let chart = this.energy.getChartOptions();
    this.chartLabels = chart.labels;
    this.chartOptions = chart.options;
    this.chartColors = chart.colors;
  }

}