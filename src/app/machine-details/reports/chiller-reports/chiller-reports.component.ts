import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { ChillerReportsService } from "./chiller-reports.service";

import { MatPaginator} from "@angular/material/paginator";

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
  selector: 'app-chiller-reports',
  templateUrl: './chiller-reports.component.html',
  styleUrls: ['./chiller-reports.component.scss']
})
export class ChillerReportsComponent implements OnInit {
  btnRef: MatButton;
  airData = '';
  componentRef: any;
  monitoredData;
  pdfData = {
    REPORT_TYPE: 'simpleReport',
    // DASHBOARD_BOX_DETAILS: this.DASHBOARD_BOX_DETAILS.MCC_DASHBOARD,
    reportFileName: 'Chiller_Report',
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
  constructor(private reportService: ChillerReportsService, private router: Router, private resolver: ComponentFactoryResolver) { }

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
            if (!Number.isNaN(value)) {
              data[key] = value.toFixed(2);
            } else {
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
            'Total Net Heat Removed': this.airData['net_heat_removed'],
            'Total kWh Of Refrigeration': this.airData['kwh_of_refrigeration'],
            'Total Coolant Flow Rate ': this.airData['flow_rate'],
            'a': '',
            'b': ''
          }
        },
        {
          TITLE: 'Energy Data',
          boxdata: {
            'Total Energy Consumption': this.airData['energy_consumption'],
            'Total Chiller Fan Power': this.airData['chiller_fan_power'],
            'Total Compressor Power': this.airData['compressor_power'],
            'Average Chiller Motor Current': this.airData['chiller_motor_current'],
            'Average Compressor Motor Current': this.airData['compressor_motor_current'],
          }
        }
      ],
      [
        {
          TITLE: 'Efficiency Data',
          boxdata: {
            'Specific Power Consumption': this.airData['specific_power_consumption'],
            'Energy Efficiency Ratio': this.airData['eer'],
            'Co-efficient Of Performance': this.airData['cop'],
          }
        },
        {
          TITLE: 'Alarms',
          boxdata: {
            'Chiller Fan Trip Count': this.airData['chiller_fan_trip'],
            'Compressor Motor Trip Count': this.airData['compressor_motor_trip'],
            'a': ''
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
    setTimeout(() => {
      this.componentRef.destroy();
    }, 20000);
  }
}
