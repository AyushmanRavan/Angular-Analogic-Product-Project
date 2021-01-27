
import { MatPaginator, MatTableDataSource,MatPaginatorIntl } from "@angular/material";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";
import { ReportsService } from "./../../reports/reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";

@Component({
  selector: "app-machine",
  templateUrl: "./machine.component.html",
  styleUrls: ["./machine.component.scss"]
})
export class MachineComponent implements  OnInit {
  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;

  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  data: any[] = [];
  loadedSpinner: boolean = true;
  plantOptions: any[];

  plantName: number;
  defaultValue: number;
  displayedColumns = ["start_time", "end_time", "status", "reason"];
  datasetLength: number;
  dataSource = new MatTableDataSource<Machine>();
  reportVal: any;
  
  pdfData: any;
  pdfReady: boolean;
  highlightForTable:string;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private error: GlobalErrorHandler,
    private machine: ReportsService
    ,private _intl:MatPaginatorIntl
  ) {}

  ngOnInit() {this.paginator._intl.itemsPerPageLabel="Records Per Page";}

  onSelect(e) {
    this.reportVal = { ...e.values, type: "machine" };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue["plant"];
    this.department = e.reportValue["department"];
    this.assembly = e.reportValue["assembly"];
    this.machineId = e.reportValue["machine"];
    this.from = this.machine.formatDate(e.reportValue["from"]);
    this.to = this.machine.formatDate(e.reportValue["to"]);
    this.interval = e.reportValue["interval"];
    this.getMachineDetails(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval
    );
  }

  getMachineDetails(
    plant,
    department,
    assembly,
    machineId,
    from,
    to,
    interval
  ) {
   this.machine.getMachineReport(
            plant,
            department,
            assembly,
            machineId,
            from,
            to,
            interval,
           0,0).subscribe(data => {this.pdfReady = false;this.setData(data)},err => this.handleError(err));
  }

  private setData(data: Machine[]) {
    if (data != null) {
      this.dataSource = new MatTableDataSource<Machine>(data);
      this.dataSource.paginator = this.paginator;
      this.pdfData = this.dataSource;
      this.pdfReady = true;
      this.loaded = false;
      this.loadedspinner = false;
    } else {
      this.loadedspinner = false;
      this.Errormsg = false;
      this.errMessage = this.error.getErrorMessage(1);
    }
  }
  getMachineHighlight = (data: any[]): string => {
    let groupedObj = this.machine.groupBy(data, 'status'),
      totalRunning,
      totalStopped,
      totalIdle; 
    totalRunning = this.getTotalDuration(groupedObj.on);
    totalStopped = this.getTotalDuration(groupedObj.off);
    totalIdle = this.getTotalDuration(groupedObj.idle);
    return `Running: ${totalRunning}(hh:mm)  |  Idle: ${totalIdle}(hh:mm) | Stopped:  ${totalStopped}(hh:mm) `;
  };
  private getTotalDuration = (data: any[]) => {
    let total = 0;
    if (data) {
      data.forEach((item: any) => {total += this.machine.getTimeDifference(item)});
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      hours = total / 3600;
      minutes = (total % 3600) / 60;
      let time=Math.trunc(hours)+':'+Math.trunc(minutes);
      return time;
    } else {
      return 0;
    }
  };
  private handleError(err, id = 0) {
    this.loaded=true;
    this.loadedspinner = false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.machine.throwError(err);
  }


}

interface Machine {
  start_time: string;
  end_time: string;
  status: string;
  reason: string;
}
