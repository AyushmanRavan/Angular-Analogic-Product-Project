import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {PccService} from './pcc.service';
import { INTERVAL_TIME } from '../../../data';
import { Router } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { AutoLogoutService } from 'src/app/auto-logout.service';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-pcc',
  templateUrl: './pcc.component.html',
  styleUrls: ['./pcc.component.scss']
})
export class PccComponent implements OnInit {
barChartOptions: any;
barChartLabels: number[] = [];
barChartLegend = true;
barChartData: any[];
chartColors: Array<any> = [];
selectedEvent;

lineChartOptions: any;
demandAnalysisChartOptions: any;
phasewiseDataChartOptions: any;
lineChartLabels: number[] = [];
lineChartLegend = true;
lineChartMPData: any[];
lineChartPowerDataPG1: any[];
lineChartPhaseData: any[];
lineChartDemandAnalysisData: any[];
lineChartColors: Array<any> = [];

pccData;

headerWithColumns = []; /* {headers : 'Position',value:'position'},{headers : 'Name',value:'name'},{headers : 'Weight',value:'weight'},{headers : 'Symbol',value:'symbol'}*/
displayedColumns: string[] ; // = this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
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

@ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private pccService: PccService, private router: Router,
    private autoLogoutService: AutoLogoutService) { }

  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = 'Records Per Page';
    setInterval(() => {
      if (this.selectedEvent) {
        this.onSelect(this.selectedEvent);
      }
    }, INTERVAL_TIME);
   }

   ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Record per Page";
    // this.dataSource.paginator = this.paginator;
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
    this.pccService.getName(e.machineID).subscribe(
      data => {
          this.getChartData(data['associated_name']);
          this.getColumnDetails(data['associated_name']);
          this.getMonitorDetails(data['associated_name']);
          this.getSummaryDetails(data['associated_name']);
      }
    );
  }
  getChartData(name: string) {
    this.pccService.getChartData(name).subscribe(data => {
      this.barChartData = this.pccService.getBarChartData(data);
      const chart = this.pccService.getChartOptions();
      this.barChartOptions = chart.options;
      this.chartColors = chart.colors;
      this.barChartLabels = chart.labels;

      this.lineChartMPData = this.pccService.getLineChartDataMP(data);
      this.lineChartPowerDataPG1 = this.pccService.getLineChartDataPowerPG1(data);
      this.lineChartPhaseData = this.pccService.getLineChartDataPhaseData(data);
      this.lineChartDemandAnalysisData = this.pccService.getLineChartDataDemandAnalysis(data); 
      

      const lchart = this.pccService.getLineChartOptions();
      this.demandAnalysisChartOptions = lchart.optionsDemandAnalysis;
      this.phasewiseDataChartOptions = lchart.optionsPhasewiseData;
      this.lineChartOptions = lchart.options;
      this.lineChartColors = lchart.colors;
      this.lineChartLabels = lchart.labels;
    });
  }
  getMonitorDetails(name: string) {
    this.pccService.getMonitor(name).subscribe(
      data => {
       this.dataSource = new MatTableDataSource<PeriodicElement>(data);
       this.dataSource.paginator = this.paginator;
       this.loadedSpinner = false;
      }
    );
  }
  getColumnDetails(name: string) {
    this.pccService.getColumn(name).subscribe(
      data => {
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
      }
    );

  }
  getSummaryDetails(name: string) {
    this.pccService.getSummary(name).subscribe(
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
        this.pccData = data;
      }
    );
  }
}
