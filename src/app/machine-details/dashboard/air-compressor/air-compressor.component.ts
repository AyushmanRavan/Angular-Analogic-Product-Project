import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";

import { Router } from "@angular/router";

import { AirCompressorService } from "./air-compressor.service"

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-air-compressor',
  templateUrl: './air-compressor.component.html',
  styleUrls: ['./air-compressor.component.scss']
})



export class AirCompressorComponent implements OnInit {
  barChartOptions: any;
  barChartLabels: number[] = [];
  barChartLegend: boolean = true;
  barChartData: any[];
  chartColors: Array<any> = [];

  lineChartOptions: any;
  lineChartLabels: number[] = [];
  lineChartLegend: boolean = true;
  lineChartData: any[];
  lineChartColors: Array<any> = [];
  airData = {};
  headerWithColumns = []; //{headers : "Position",value:"position"},{headers : "Name",value:"name"},{headers : "Weight",value:"weight"},{headers : "Symbol",value:"symbol"}
  displayedColumns: string[];//= this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
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
  constructor(private compressorService: AirCompressorService, private router: Router) {
    const operationalDataLabels = ['Total Air Flow (CFM)', 'Total Compressed Air Flow Volume (Ton)'];
  }

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";

  }
  getZeroString(n) {
    return n > 9 ? "" + n : "0" + n;
  }


  getTimeString(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const ConvertedHrs = this.getZeroString(hrs);
    seconds -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    const ConvertedMnts = this.getZeroString(mnts);
    seconds -= mnts * 60;
    const ConvertedSecs = this.getZeroString(seconds);
    return `${ConvertedHrs} : ${ConvertedMnts} : ${ConvertedSecs}`;
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
    } else {
      return true;
    }
  }
  goTo(route: string) {
    this.router.navigate([`machinedetail/${route}`], {
      queryParams: {
        'plantID': this.plantID,
        'departmentID': this.departmentID,
        'assemblyID': this.assemblyID,
        'machineID': this.machineID
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
    this.compressorService.getName(e.machineID).subscribe(
      data => {
        this.getChartData(data["associated_name"]);
        this.getColumnDetails(data["associated_name"]);
        this.getMonitorDetails(data["associated_name"]);
        this.getSummaryDetails(data["associated_name"]);
      }
    );

  }
  getChartData(name: string) {
    this.compressorService.getChartData(name).subscribe(data => {
      this.barChartData = this.compressorService.getBarChartData(data);
      const chart = this.compressorService.getChartOptions();
      this.barChartOptions = chart.options;
      this.chartColors = chart.colors;
      this.barChartLabels = chart.labels;
      this.lineChartData = this.compressorService.getLineChartData(data);
      const lchart = this.compressorService.getLineChartOptions();
      this.lineChartOptions = lchart.options;
      this.lineChartColors = lchart.colors;
      this.lineChartLabels = lchart.labels;
      this.loadedSpinner = false;
    });
  }
  getMonitorDetails(name: string) {
    this.compressorService.getMonitor(name).subscribe(
      data => {
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        this.dataSource.paginator = this.paginator;
      }
    );

  }
  getColumnDetails(name: string) {
    this.compressorService.getColumn(name).subscribe(
      data => {
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
      }
    );

  }
  getSummaryDetails(name: string) {
    this.compressorService.getSummary(name).subscribe(
      (data: any[]) => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const tempArray = [];
            data[key].map((subData) => {
              if (subData.parameterName.includes('Hours')) {
                subData['convertedCurrentData'] = this.getTimeString(subData.currentData);
                subData['convertedIncreasedValue'] = this.getTimeString(subData.increasedValue);
              } else {
                if (subData.parameterName !== 'Current Status') {
                  subData['convertedCurrentData'] = (!Number.isNaN(Number(subData.currentData)) && subData.currentData != null) ?
                    Number(subData.currentData).toFixed(2) : subData.currentData;
                  subData['convertedIncreasedValue'] = (!Number.isNaN(Number(subData.increasedValue)) && subData.increasedValue != null) ?
                    Math.abs(Number(subData.increasedValue)).toFixed(2) : subData.increasedValue;
                }
                subData['convertedCurrentData'] = subData.currentData;
              }
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



