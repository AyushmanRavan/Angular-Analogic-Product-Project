import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";

import { Router } from "@angular/router";

import { ChillerService} from "./chiller.service"

export interface PeriodicElement {
  position: number;
  name: string;  
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-chiller',
  templateUrl: './chiller.component.html',
  styleUrls: ['./chiller.component.scss']
})
export class ChillerComponent implements OnInit {

  lineChartOptions: any;
  lineChartLabels: number[] = [];
  lineChartLegend: boolean = true;
  lineChartData: any[];
  lineChartColors: Array<any> = [];

  barChartDataEC: any[];
  barChartDataCFC: any[];
  barChartDataCEC : any[];
  lineChartDataSecond : any[];
  airData={};
  headerWithColumns = []; //{headers : "Position",value:"position"},{headers : "Name",value:"name"},{headers : "Weight",value:"weight"},{headers : "Symbol",value:"symbol"}
  displayedColumns: string[] ;//= this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  loaded: boolean = true;
  loadedSpinner: boolean = true;
  isPaginatorLoading: boolean;
  Errormsg: boolean;
  errMessage: string;
  empty: boolean = true;

  machineName: string;
  plantFilter: string;
  departmentFilter: string;
  assemblyFilter: string;
  machinesFilter: string;
  summary: any;

  plantID: number;
  departmentID: number;
  assemblyID: number;
  machineID: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private compressorService: ChillerService,private router : Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  getTimeString(seconds) {
    const hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    return `${hrs} : ${mnts} : ${seconds}`;
  }
  getArrowColor(increasedValue, isForward) {
    if (increasedValue > 0) {
      if (isForward === true) {
        return true;
      } else {
        return false;
      }
    } else if (increasedValue < 0) {
      if (isForward === true) {
        return false;
      } else {
        return true;
      }
    }else {
      return true;
    }
  }
  goTo(route: string) {
    this.router.navigate([`machinedetail/${route}`], {
      queryParams : {
        'plantID' : this.plantID,
        'departmentID' : this.departmentID,
        'assemblyID' : this.assemblyID,
        'machineID' : this.machineID
      }
    });
  }
  onSelect(e) {
    this.loaded = true;
    this.empty = false;
    this.loadedSpinner = true;
    this.Errormsg = true;
    this.plantID = e.plantID;
    this.departmentID = e.departmentID;
    this.assemblyID = e.assemblyID;
    this.machineID = e.machineID;
    //this.getProductionDetails(e.machineID);
    this.compressorService.getName(e.machineID).subscribe(
      data => {
          this.getChartData(data["associated_name"]);
          this.getColumnDetails(data["associated_name"]);
          this.getMonitorDetails(data["associated_name"]);    
          this.getSummaryDetails(data["associated_name"]);
      }
    );
  }

  getChartData(name : string){
    this.compressorService.getChartData(name).subscribe(data => {
      this.lineChartData = this.compressorService.getLineChartData(data)
      const lchart = this.compressorService.getLineChartOptions();
      this.lineChartOptions = lchart.options;
      this.lineChartColors = lchart.colors;
      this.lineChartLabels = lchart.labels;

      this.barChartDataEC = this.compressorService.getBarChartDataForEC(data);
      this.barChartDataCFC = this.compressorService.getBarChartDataForCFC(data);
      this.barChartDataCEC = this.compressorService.getBarChartDataForCEC(data);
      this.lineChartDataSecond = this.compressorService.getLineChartDataSecond(data);
    });
  }

  getMonitorDetails(name: string) {
    this.compressorService.getMonitor(name).subscribe(
      data => {
       this.dataSource = new MatTableDataSource<PeriodicElement>(data);
       this.dataSource.paginator = this.paginator;
       this.loadedSpinner = false;
      }
    );
  }
  getColumnDetails(name : string){
    this.compressorService.getColumn(name).subscribe(
      data => {
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
      }
    );
  }
  getSummaryDetails(name : string){
    this.compressorService.getSummary(name).subscribe(
      (data:any[]) => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const tempArray = [];
              data[key].map((subData) => {
                    subData['convertedCurrentData'] = (!Number.isNaN(Number(subData.currentData)) && subData.currentData != null) ?
                    Number(subData.currentData).toFixed(2) :  subData.currentData ;
                    subData['convertedIncreasedValue'] = (!Number.isNaN(Number(subData.increasedValue)) && subData.increasedValue != null) ?
                    Math.abs(Number(subData.increasedValue)).toFixed(2) : subData.increasedValue;
              });
            for (let i = 1; i <= data[key].length; i++) {
              data[key].map((subData) => {
                if (subData.sequenceNumber === i) {
                  tempArray.push(subData);
                }
              });
            }
            data[key] = tempArray;
          }
        }
        this.airData = data;
      }
    );
  }
}
