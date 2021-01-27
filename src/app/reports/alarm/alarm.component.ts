import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource,MatPaginatorIntl } from "@angular/material";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { ReportsService } from "./../../reports/reports.service";

@Component({
  selector: "app-alarm",
  templateUrl: "./alarm.component.html",
  styleUrls: ["./alarm.component.scss"]
})
export class AlarmComponent implements OnInit {
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
  displayedColumns = ["alarmName", "alarmIntime","alarmOntime"];
  datasetLength: number;
  dataSource = new MatTableDataSource<Alarm>();
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  
  alarmSummaryDisplayedColumns=['name', 'count', 'duration'];
  alarmSummaryDatasource = new MatTableDataSource<any>();;
  highlights:string;
  constructor(
    private error: GlobalErrorHandler,
    private alarm: ReportsService,private _intl:MatPaginatorIntl
  ) {}
  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel="Records Per Page";
  }
 
  onSelect(e) {
    this.reportVal = { ...e.values, type: "alarm" };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue["plant"];
    this.department = e.reportValue["department"];
    this.assembly = e.reportValue["assembly"];
    this.machineId = e.reportValue["machine"];
    this.from = this.alarm.formatDate(e.reportValue["from"]);
    this.to = this.alarm.formatDate(e.reportValue["to"]);
    this.interval = e.reportValue["interval"];
     this.AlarmDetails(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval
    );
  }

  AlarmDetails(plant, department, assembly, machineId, from, to, interval) {
     this.alarm.getAlarmReport(
            plant,
            department,
            assembly,
            machineId,
            from,
            to,
            interval,
            0,0)
      .subscribe(data => {  this.pdfReady = false;this.setData(data)},err => this.handleError(err));
    }

  private setData(data: Alarm[]) {
    if (data != null) {
      this.dataSource = new MatTableDataSource<Alarm>(data);
      this.dataSource.paginator = this.paginator;
      this.pdfData =data;
      this.pdfReady = true;
      this.alarmSummaryDatasource=new MatTableDataSource<any>(this.alarm.getAlarmSummary(data));
      this.highlights=this.getAlarmHighlight(data);
      this.loaded = false;
      this.loadedspinner = false;
    } else {
      this.loadedspinner = false;
      this.Errormsg = false;
      this.errMessage = this.error.getErrorMessage(1);
    }
  }

  getAlarmHighlight = (data: any[]): string => `Total Alarms: ${data.length}`;
    private handleError(err, id = 0) {
      this.loaded=true;
      this.loadedspinner = false;
      this.Errormsg = false;
      this.errMessage = this.error.getErrorMessage(id);
      this.alarm.throwError(err);
    }
}
interface Alarm {
  alarmName: string;
  alarmIntime: string;
  alarmOntime: string;
  dateTime?: string;
}
