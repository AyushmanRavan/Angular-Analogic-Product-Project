import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { MccService } from './mcc.service';
import { Observable } from 'rxjs';
import { INTERVAL_TIME } from '../../../data';
import { Router } from "@angular/router";

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-mcc',
  templateUrl: './mcc.component.html',
  styleUrls: ['./mcc.component.scss']
})
export class MccComponent implements OnInit {
  barChartOptions: any;
  barChartLabels: number[] = [];
  barChartLegend = true;
  barChartData: any[];
  chartColors: Array<any> = [];

  lineChartOptions: any;
  lineChartLabels: number[] = [];
  lineChartLegend = true;
  lineChartData: any[];
  lineChartPowerDataPG1: any[];
  lineChartPowerDataPG2: any[];
  lineChartPowerQualityData: any[];
  lineChartDemandAnalysisData: any[];
  lineChartColors: Array<any> = [];
  demandAnalysisChartOptions: any;

  mccData;

  headerWithColumns = []; /* {headers : 'Position',value:'position'},{headers : 'Name',value:'name'},{headers : 'Weight',value:'weight'},{headers : 'Symbol',value:'symbol'}*/
  displayedColumns: string[]; // = this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  loaded = true;
  loadedSpinner = true;
  isPaginatorLoading: boolean;
  Errormsg: boolean;
  errMessage: string;
  empty = true;

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

  selectedEvent: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private mccService: MccService, private router: Router) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Records Per Page';
      setInterval(() => {
        if (this.selectedEvent) {
          this.onSelect(this.selectedEvent);
        }
      }, INTERVAL_TIME);
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
    this.router.navigate([`ems/${route}`], {
      queryParams : {
        'plantID' : this.plantID,
        'departmentID' : this.departmentID,
        'assemblyID' : this.assemblyID,
        'machineID' : this.machineID
      }
    });
  }
  onSelect(e) {
    this.selectedEvent = e;
    this.loaded = true;
    this.empty = false;
    this.loadedSpinner = true;
    this.Errormsg = true;
    this.plantID = e.plantID;
    this.departmentID = e.departmentID;
    this.assemblyID = e.assemblyID;
    this.machineID = e.machineID;
    this.mccService.getName(e.machineID).subscribe(
      data => {
        this.getChartData(data['associated_name']);
        this.getColumnDetails(data['associated_name']);
        this.getMonitorDetails(data['associated_name']);
        this.getSummaryDetails(data['associated_name']);
      }
    );
  }
  getChartData(name: string) {
    this.mccService.getChartData(name).subscribe(data => {
      this.barChartData = this.mccService.getBarChartData(data);
      const chart = this.mccService.getChartOptions();
      this.barChartOptions = chart.options;
      this.chartColors = chart.colors;
      this.barChartLabels = chart.labels;
      this.lineChartData = this.mccService.getLineChartDataMP(data);
      this.lineChartPowerDataPG1 = this.mccService.getLineChartDataPowerPG1(data);
      this.lineChartPowerDataPG2 = this.mccService.getLineChartDataPowerPG2(data);
      this.lineChartPowerQualityData = this.mccService.getLineChartDataPowerQuality(data);
      this.lineChartDemandAnalysisData = this.mccService.getLineChartDataDemandAnalysis(data);
      const lchart = this.mccService.getLineChartOptions();
      this.demandAnalysisChartOptions = lchart.optionsDemandAnalysis;
      this.lineChartOptions = lchart.options;
      this.lineChartColors = lchart.colors;
      this.lineChartLabels = lchart.labels;
    });
  }
  getMonitorDetails(name: string) {
    this.mccService.getMonitor(name).subscribe(
      data => {
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        this.dataSource.paginator = this.paginator;
        this.loadedSpinner = false;
      }
    );
  }
  getColumnDetails(name: string) {
    this.mccService.getColumn(name).subscribe(
      data => {
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
      }
    );

  }
  getSummaryDetails(name: string) {
    this.mccService.getSummary(name).subscribe(
      (data: any[]) => {
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
        this.mccData = data;
      }
    );
  }
}




