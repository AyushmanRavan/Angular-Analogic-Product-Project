import { Component,  ViewChild, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator,  MatPaginatorIntl } from "@angular/material/paginator";
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { GlobalErrorHandler } from '../../../core/services/error-handler';
import { EmsMonitoringParamService } from './ems-monitoring-param.service';
import {  ActivatedRoute } from "@angular/router";
import { DATA } from 'src/app/core/data.enum';
import { StorageServiceService } from 'src/app/core/services/auth/storage-service.service';
import { MatTableDataSource } from "@angular/material/table";

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-ems-monitoring-param',
  templateUrl: './ems-monitoring-param.component.html',
  styleUrls: ['./ems-monitoring-param.component.scss']
})
export class EmsMonitoringParamComponent implements OnInit {

  allTableData: any;
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
  chartAPIData: any[];
  Data: any[];
  chartColors: any[];
  paramName: string;

  list: any[] = [];
  datasetLength: number;
  // displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  data: MatTableDataSource<any> = new MatTableDataSource<any>();
  array = [];
  summary: any = {
    totalConsumed: 0
  };
  machineID: number;
  machineName: string;
  TableData: any[];

  /* new datasource for table */
  headerWithColumns = []; //{headers : "Position",value:"position"},{headers : "Name",value:"name"},{headers : "Weight",value:"weight"},{headers : "Symbol",value:"symbol"}
  displayedColumns: string[] = [];//= this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild("baseChart")  chart: BaseChartDirective;

  selectedParameter: any[] = [];
  selected: any;
  routerParamsObj: any = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private error: GlobalErrorHandler,
    private energy: EmsMonitoringParamService, private _intl: MatPaginatorIntl,
     private storageServiceService: StorageServiceService,
    private route: ActivatedRoute
  ) {
    this.setupChart();
  }

  ngOnInit() {
    this.storageServiceService.setStorageItem(DATA.LAST_ACTION, Date.now().toString());
    const routerParams = this.route.snapshot.queryParamMap.keys;
    routerParams.map((param) => {
      if (this.route.snapshot.queryParamMap.has(param)) {
        this.routerParamsObj[param] = Number(this.route.snapshot.queryParamMap.get(param));
      }
    });
    //this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Record per Page";
    // this.dataSource.paginator = this.paginator;
  }

  onSelect(e) {
    this.loaded = true;
    this.loadedSpinner = true;
    this.Errormsg = true;
    this.machineID = e.machineID;
    this.energy.getName(e.machineID).subscribe(
      data => {
        // this.getChartData(data["associated_name"]);
        // this.getColumnDetails(data["associated_name"]);
        // this.getMonitorDetails(data["associated_name"]);    
        // this.getSummaryDetails(data["associated_name"]);
        this.machineName = data["associated_name"];
        this.getEnergyParamters(data["associated_name"], 'all');
        this.energy.getColumn(data["associated_name"], "all").subscribe(data => {
          this.headerWithColumns = data;
          this.displayedColumns = this.headerWithColumns.map(row => row.value);

        });
        //this.getEnergyParamters(data["associated_name"],e.dbType);
      }
    );


  }
  onParamsChange(value) {
    // this.chartData.length = 0;
    const tempArray = [];
    const newChartData = [];
    this.Data = this.energy.getChartLabels(this.chartAPIData, value, this.headerWithColumns);
    if (this.Data.length > 0) {
      this.Data.map((temp) => {
        const testObj = {};
        testObj['maxData'] = Math.max(...temp.data);
        testObj['label'] = temp.label;
        tempArray.push(testObj);
      });
      tempArray.sort((a, b) => {
        return b.maxData - a.maxData;
      });
      tempArray.map((temp) => {
        
      });
     // this.Data = this.Data.reverse();
     tempArray.map((temp) => {
        this.Data.map((oldData) => {
          if (temp.label === oldData.label) {
            newChartData.unshift(oldData);
          }
        });
     });
      this.chartData = newChartData;
      if (this.chart !== undefined) {
        // this.chart.ngOnDestroy();
        // this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        this.chart.chart.destroy();
        this.chart.chart.clear();

        this.chart.datasets = newChartData;
        // this.chart.labels = this.labels;
        this.chart.ngOnInit();


      }
      //this.getTableData(value);
     const newData =  this.setNewTableData(value);
      this.setTableData(newData);
      this.isParamloading = false;
      this.loaded = false;
      this.Errormsg = true;
      this.loadedSpinner = false;
    }
    else {
      const newData =  this.setNewTableData(value);
      this.setTableData(newData);
      let dummyData = [{ data: [{}], label: "Null" }]
      this.chartData = dummyData;
      if (this.chart !== undefined) {

        this.chart.chart.destroy();
        this.chart.chart.clear();
        this.chart.datasets = dummyData;
        // this.chart.labels = this.labels;
        this.chart.ngOnInit();
      }
      this.errMessage = this.error.getErrorMessage(1);
      this.Errormsg = false;
      this.loaded = true;
      this.loadedSpinner = false;

    }
    //let cdata = this.energy.getChartLabels(this.chartAPIData,value);






  }
  public setNewTableData(paramList) {
    // this.allTableData;
    const subData = [];
   // const tempObj = {};
    const tempData = this.allTableData.map((data) => {
    const tempObj = {};
      const d = data;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {

          if ( key === 'start_time' || key === 'end_time') {
            tempObj[key] = data[key];
          } else {
              paramList.map((param) => {
                if (key === param) {
                    tempObj[key] = data[key];
                }
              });
          }
        }
      }
      subData.push(tempObj);
     // return subData;
  });
    return subData;
  }

  private getEnergyParamters(machineName: string, dbType: string) {
    // this.chartAPIData = [];
    // this.Data = [];
    // this.chartData = [];
  this.defaultValue = [];
  this.selectedParameter = [];
    this.selectedParameter.length = 0;
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

  // this.energy.getParameters(machineId).subscribe(data => {
  //   for (let i = 0; i < data.length; i++) {
  //     if (data[i].param_type == "datetime" || data[i].param_type == "varchar" || data[i].param_type == "bit") {
  //     } else {
  //       this.paramName = data[i].param_name;
  //       if (this.paramName.toUpperCase() != "PRODUCTION_COST") this.paramList.push(data[i]);
  //     }
  //   }
  //   this.defaultValue.push(this.paramList[0]);
  //   this.selectedParameter.push(this.paramList[0]);
  //   this.compareParameter(this.paramList, this.selectedParameter);
  //   this.energy.getEnergyDetails(machineId, this.defaultValue).subscribe(data => { this.setDataChart(data) },err => this.handleError(err));
  //   this.getTableData(this.paramList);
  //   this.onChange(this.defaultValue);
  // });
  this.paramList.length = 0;
  // if(this.allTableData.length > 1){
  //   this.allTableData.length = 0;
  // }
  this.energy.getColumn(machineName, dbType).subscribe(data => {

    const filterData = data.filter(row => {
      return row.value !== "start_time" && row.value !== "end_time"
    });
    /// filterData && filterData[0] &&
    filterData.map(row => {
      this.paramList.push(row);
     // this.selectedParameter.push(row.value);
    });

    
    this.defaultValue.push(this.paramList[0]);
    this.selectedParameter.push(this.paramList[0].value);
    this.compareParameter(this.paramList, this.selectedParameter);
    //  this.selectedParameter = filterData[0].value;
    // this.headerWithColumns = data;
    // this.displayedColumns = this.headerWithColumns.map(row => row.value);

    // this.energy.getColumn(machineName,"all").subscribe(data => {

    //   this.headerWithColumns = data;
    //   this.displayedColumns = this.headerWithColumns.map(row => row.value);
    // })

    let tableHeader = data.filter(row => {
      return row.value != "start_time" || row.value != "end_time"
    })
    //  this.headerWithColumns = tableHeader;
    // this.displayedColumns = this.headerWithColumns.map(row => row.value);
  });
   if (machineName) {
    this.energy.getChartDataNew(machineName).subscribe(data => {

      this.chartAPIData = data;
      // this.Data = this.energy.getChartLabels(this.chartAPIData, this.selectedParameter, this.headerWithColumns);
      this.chartData = this.energy.getChartLabels(this.chartAPIData, this.selectedParameter, this.headerWithColumns);
      
      if (this.chart !== undefined) {
        // this.chart.ngOnDestroy();
        // this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        this.chart.chart.destroy();
        this.chart.chart.clear();
        this.chart.datasets = this.chartData ;
        // this.chart.labels = this.labels;
        this.chart.ngOnInit();
      }

      // this.chartData = this.Data;
      // let chart = this.energy.getChartOptions();
      // this.chartOptions = chart.options;
      // this.chartColors = chart.colors;
      // this.chartLabels = chart.labels;
    });
   }

  if (machineName) {
    this.energy.getMonitor(machineName).subscribe(
      data => {
        this.allTableData = data;
        const newData =  this.setNewTableData(this.selectedParameter);
        this.setTableData(newData);
        // this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        // this.dataSource.paginator = this.paginator;
        // this.loaded = true;
        this.loadedSpinner = false;
      });
  }
}

// onChange(e) {
//   this.isParamloading = true;
//   this.energy.getEnergyDetails(this.machineID, e).subscribe(data => this.setDataChart(data));
//   this.compareParameter(this.paramList, e);
// }

compareParameter(param1: any, param2: any) {
  return param1 && param2 ? param1.param_name === param2.param_name : param1 === param2;
}

  // private setDataChart(data) {
  //   if (data.length > 0) {
  //     this.Data = this.energy.getChartData(data.reverse());
  //     this.chartData = this.Data;

  //     if (this.chart !== undefined) {
  //       this.chart.ngOnDestroy();
  //       this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
  //     }
  //     this.isParamloading = false;
  //     this.loaded = false;
  //     this.Errormsg = true;
  //     this.loadedSpinner = false;
  //   } else {
  //     this.errMessage = this.error.getErrorMessage(1);
  //     this.Errormsg = false;
  //     this.loaded = true;
  //     this.loadedSpinner = false;
  //   }
  // }

  private setupChart() {
  let chart = this.energy.getChartOptions();
  this.chartLabels = chart.labels;
  this.chartOptions = chart.options;
  this.chartLabels = chart.labels;
  this.chartColors = chart.colors;
}

  private getTableData(paramList) {
  this.energy.getEnergyDetails(this.machineID, paramList).subscribe(data => { this.setTableData(data) });
}

setTableData(data) {
  if (data) {
    this.dataSource = new MatTableDataSource<PeriodicElement>(data);
    this.dataSource.paginator = this.paginator;
    this.loaded = true;
    this.loadedSpinner = false;
    this.displayedColumns = ['start_time', 'end_time'];
   this.columnsToDisplay = ['start_time', 'end_time'];
    for (const key in data[0]) {
      if (data[0].hasOwnProperty(key)) {
        if (key !== 'start_time' && key !== 'end_time') {
          this.displayedColumns.push(key);
          this.columnsToDisplay.push(key);
        }

      }
    }
    this.isPaginatorLoading = false;
  }


  // let cols = ["production_cost", "StartTime", "EndTime"];
  // let TableData;
  // if (data != null) {
  //   this.summary = {
  //     totalConsumed: this.energy.getTotalConsumed(data)
  //   };

    // this.data = new MatTableDataSource<PeriodicElement>(data);
    // this.data.paginator = this.paginator;

   
    // this.loaded = false;
    // this.loadedSpinner = false;
    // this.Errormsg = true;
    // } else {
    //   this.loadedSpinner = false;
    //   this.Errormsg = false;
    //   this.errMessage = this.error.getErrorMessage(1);
    //   this.loaded = true;
    // }
}


  private handleError(err, id = 0) {
  this.loaded = true;
  this.loadedSpinner = false;
  this.Errormsg = false;
  this.errMessage = this.error.getErrorMessage(id);
  this.energy.throwError(err);
}

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];


