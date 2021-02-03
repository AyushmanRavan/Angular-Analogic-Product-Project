import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { BoilerReportsService } from "./boiler-reports.service";
import { MatPaginator } from "@angular/material/paginator";

import { Router } from "@angular/router";


import { NewPdfComponent } from '../../../new-pdf/new-pdf.component';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-boiler-reports',
  templateUrl: './boiler-reports.component.html',
  styleUrls: ['./boiler-reports.component.scss']
})
export class BoilerReportsComponent implements OnInit {
  matButtonRef: MatButton;
  airData = '';
  componentRef: any;
  monitoredData;
  pdfData = {
    REPORT_TYPE: 'simpleReport',
    // DASHBOARD_BOX_DETAILS: this.DASHBOARD_BOX_DETAILS.MCC_DASHBOARD,
    reportFileName: 'Boiler_Report',
    reportPaperSize: 'A2',
    reportLandscap: false
  };
  //  {
  //   "total_energy_consumed" : "1418.0",
  //   "specific_power_consumption" : "23.70243248",
  //   "total_air_compressed" : "647.0"
  // };
  headerWithColumns = []; //{headers : "Position",value:"position"},{headers : "Name",value:"name"},{headers : "Weight",value:"weight"},{headers : "Symbol",value:"symbol"}
  displayedColumns: string[];//= this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  datasetLength: number;
  loaded: boolean = true;
  loadedSpinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  data: any[] = [];
  plantOptions: any[];
  plantName: number;
  defaultValue: number;
  reportVal: any;
  pdfReady: boolean;

  highlightForTable: string;
  @ViewChild('pdfContainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private reportService: BoilerReportsService, private router: Router, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Record per Page";
    // this.dataSource.paginator = this.paginator;
  }
  
  goTo(route: string) {
    this.router.navigate([`machinedetail/${route}`]);
  }

  onSelect(e) {
    if (this.matButtonRef === undefined) {
      this.matButtonRef = e.downloadPdfBtnRef;
      this.matButtonRef._elementRef.nativeElement.addEventListener('click', this.createComponent.bind(this));
    }
    this.reportVal = { ...e.values, type: "production" };
    this.loadedSpinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue["plant"];
    this.department = e.reportValue["department"];
    this.assembly = e.reportValue["assembly"];
    this.machineId = e.reportValue["machine"];
    this.from = this.reportService.formatDate(e.reportValue["from"]);
    this.to = this.reportService.formatDate(e.reportValue["to"]);
    this.interval = e.reportValue["interval"];

    this.pdfData['plantDetails'] = {
      plant: this.reportVal.plant,
      department: this.reportVal.department,
      machine: this.reportVal.machine,
      from: this.reportVal.from,
      to: this.reportVal.to,
      interval: this.reportVal.interval
    };

    this.reportService.getName(e.reportValue["machine"]).subscribe(
      data => {
        this.getSummaryDetail(
          this.plant,
          this.department,
          this.assembly,
          data["associated_name"],
          this.from,
          this.to,
          this.interval
        );
        this.getColumnDetails(data["associated_name"]);
        this.getMonitorDetails(data["associated_name"], this.from, this.to, this.interval, this.matButtonRef);
        // this.getColumnDetails(data["associated_name"]);
        // this.getMonitorDetails(data["associated_name"]);    
        // this.getSummaryDetails(data["associated_name"]);
      }
    )
    // this.getProductionDetails(
    //   this.plant,
    //   this.department,
    //   this.assembly,
    //   this.machineId,
    //   this.from,
    //   this.to,
    //   this.interval
    // );
  }

  getSummaryDetail(
    plant,
    department,
    assembly,
    machineName,
    from,
    to,
    interval
  ) {
    this.reportService.getSummary(machineName, from, to, interval).subscribe(
      data => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = Number(data[key]);
            if ( ! Number.isNaN(value)) {
              data[key] = value.toFixed(2);
            }else {
              data[key] = data[key];
            }
          }
        }
        this.airData = data;
        this.pdfData['summaryData'] = this.generatePdfSummaryData();
      }
    );
  }
  getMonitorDetails(machineName,
    from,
    to,
    interval, btnRef) {
    this.reportService.getMonitor(machineName, from, to, interval).subscribe(
      data => {
        let temp = {};
        const pdfMonitoringRowData = [];
        if(data){
          this.monitoredData = data;
          this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        }
        if(this.monitoredData){
          this.monitoredData.map((row) => {
            this.displayedColumns.map((col) => {
              for (const key in row) {
                if (row.hasOwnProperty(col)) {
                  if (key === col) {
                    temp[key] = row[key];
                  }
                } else {
                  temp[col] = '';
                }
              }
            });
            pdfMonitoringRowData.push(temp);
            temp = {};
          });
        }
        
        this.dataSource.paginator = this.paginator;
        this.loadedSpinner = false;
        this.pdfData['monitoringDataRow'] = pdfMonitoringRowData;
        btnRef._elementRef.nativeElement.disabled = false;


        // this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        // this.dataSource.paginator = this.paginator;
        // this.loadedSpinner = false;
      }
    );

  }

  getColumnDetails(name: string) {
    this.reportService.getColumn(name).subscribe(
      data => {
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
        this.pdfData['monitoringDataColumn'] = this.headerWithColumns;
      }
    );
  }
  
  generatePdfSummaryData() {
   const tempData = [
      [
        {
          TITLE: 'Operational Data',
          boxdata: {
            'Total Steam Produced' : this.airData['steam_produced'],
            'Total Fuel 1 Consumption': this.airData['consumed_fuel_1'],
            'Total Fuel 2 Consumption': this.airData['consumed_fuel_2'],
            'Total Fuel 3 Consumption': this.airData['consumed_fuel_3'],
            'Total Air Flow': this.airData['air_flow'],
            'Average Steam Pressure': this.airData['steam_pressure'],
            'Average Steam Temperature (mmWC)': this.airData['furnace_drought'],
            'Average CO2/O2 Monitoring': this.airData['o2_co2'],
            'Average Steam Temperature': this.airData['steam_temperature'],
            'Average Boiler Feed Air Temperature': this.airData['feed_air_temperature'],
            'Average Dryness fraction': this.airData['dryness_fraction'],
          }
        },
        {
          TITLE: 'Energy Data',
          boxdata: {
            'Total ID Fan Consumption': this.airData['id_fan_consumption'],
            'Total FD Fan Consumption': this.airData['fd_fan_consumption'],
            'Total Feed Water Pump Consumption': this.airData['feed_water_pump_consumption'],
            'Average ID Fan Current': this.airData['id_fan_current'],
            'Average FD Fan Current': this.airData['fd_fan_current'],
            'Average Feed Water Current': this.airData['feed_water_pump_current'],
            'a': '',
            'b': '',
            'c': '',
            'd': '',
            'e': ''
          }
        }
      ],
      [
        {
          TITLE: 'Efficiency Data',
          boxdata: {
            'Direct Efficiency' : this.airData['direct_efficiency'],
            'Steam/Fuel Ratio' : this.airData['steam_fuel_ratio'],
            'Air/Fuel Ratio' : this.airData['air_fuel_ratio'],
          }
        },
        {
          TITLE: 'Alarms',
          boxdata: {
            'ID Fan Trip Count': this.airData['id_trip'],
            'FD Fan Trip Count': this.airData['fd_trip'],
            'Feed Water Pump Trip Count': this.airData['bfp_trip'],

          }
        }
      ]
    ];
    return tempData;
  }

  createComponent() {
    this.reportService.pdfDownloadService().subscribe((res) => {
      // console.log(res);
    });
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(NewPdfComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.getPdfData(this.pdfData);
    setTimeout(() =>  {
     this.componentRef.destroy();
     }, 20000);
  }

}
