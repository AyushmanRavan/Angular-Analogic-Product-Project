import { Component, OnInit, ViewChild,  ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { AirCompressorReportsService } from "./air-compressor-reports.service";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
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
  selector: 'app-air-compressor-reports',
  templateUrl: './air-compressor-reports.component.html',
  styleUrls: ['./air-compressor-reports.component.scss']
})
export class AirCompressorReportsComponent implements OnInit {
  btnRef: MatButton;
  airData = '';
  monitoredData;
  pdfData = {
    REPORT_TYPE: 'simpleReport',
    // DASHBOARD_BOX_DETAILS: this.DASHBOARD_BOX_DETAILS.MCC_DASHBOARD,
    reportFileName: 'Compressor_Report',
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

  @ViewChild('pdfContainer', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private reportService: AirCompressorReportsService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = 'Records Per Page';
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Record per Page";
    // this.dataSource.paginator = this.paginator;
  }
  goTo(route: string) {
    this.router.navigate([`machinedetail/${route}`]);
  }

  onSelect(e) {

    if (this.btnRef === undefined) {
      this.btnRef = e.downloadPdfBtnRef;
      this.btnRef._elementRef.nativeElement.addEventListener('click', this.createComponent.bind(this));
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
        this.getMonitorDetails(data["associated_name"], this.from, this.to, this.interval, this.btnRef);
       
      }
    );
   
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
            if (!Number.isNaN(value)) {
              data[key] = value.toFixed(2);
            } else {
              data[key] = data[key];
            }
          }
        }
        this.airData = data;
        this.pdfData['summaryData'] = [
          [
            {
              TITLE: 'Operational Data',
              boxdata: {
                'Total Air Flow': this.airData['total_air_flow'],
                'Compressed Air Flow Volume': this.airData['total_air_compressed'],
              }
            },
            {
              TITLE: 'Energy Data',
              boxdata: {
                'Power Consumption': this.airData['total_energy_consumed'],
                'Current': this.airData['motor_current'],
              }
            }
          ],
          [
            {
              TITLE: 'Efficiency Data',
              boxdata: {
                'Specific Power Consumption': this.airData['specific_power_consumption'],
              }
            },
            {
              TITLE: 'Alarms',
              boxdata: {
                'Number Of Compressor Motor Trips': this.airData['trip'],
              }
            }
          ],
          [
            {
              TITLE: 'Machine Status',
              boxdata: {
                'Running Hours': this.airData['running_hours'],
                'Idle Hours': this.airData['idle_hours'],
                'Stop Hours': this.airData['stop_hours'],
                'Stop Pages': this.airData['number_of_stopages'],
                'Current Status': this.airData['current_status']
              }
            }
          ]
        ];
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
        if (data) {
          this.monitoredData = data;
          this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        }
        if (this.monitoredData) {
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

  createComponent() {
    this.reportService.pdfDownloadService().subscribe((res) => {
      // console.log(res);
    });

    const factory = this.componentFactoryResolver.resolveComponentFactory(NewPdfComponent);

    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Use the reference to interact with the component by assigning to its properties or calling its methods.
    componentRef.instance.getPdfData(this.pdfData);

    setTimeout(() => {
      componentRef.destroy();
    }, 20000);
  }

}
