import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurationService } from './../../configuration/configuration.service';
import { ReportsService } from "../reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { DATA } from "src/app/core/data.enum";
import { StorageServiceService } from "src/app/core/services/auth/storage-service.service";

@Component({
  selector: "report-form",
  templateUrl: "./report-form.component.html",
  styleUrls: ["./report-form.component.scss"]
})
export class ReportFormComponent implements OnInit {
  @Output()
  select = new EventEmitter();
  @Output()
  sendType = new EventEmitter<string>();

  @Input()
  type: string;
 
  @Input() reports: string;
  @Input() page: string;
  @Input() flag: boolean;

  @Input()
  reportViewer: any; 

  reportName: string;
  report: FormGroup;

  showReportView: boolean = false;
  reportView: FormGroup;
  plantOptions = [];
  deptOptions = [];
  assemblyOptions = [];
  machineOptions = [];
  machineId: number; // for energy manegement reports
  insight: Insight = new Insight();
  show: boolean;
  fromStartAt;
  toStartAt;
  max: Date = new Date();
  min: Date = new Date();
  tableType = ['monitoring', 'summary'];
  reportOptions: any[];
  reportType: string;
  shifts: any[] = [];
  showShift: boolean = false;
  showOeeInterval: boolean = false;
  intervalField: boolean = true;
  intervalForDynamic: boolean = false;
  showTime: string;
  showInterval: boolean;
  oeeFrom: any;

  constructor(
    private error: GlobalErrorHandler,
    private fb: FormBuilder,
    private selection: ReportsService,
    private snack: MatSnackBar,
    private config: ConfigurationService,
    private storageServiceService: StorageServiceService
  ) {
    this.report = this.fb.group({
      plant: ["", Validators.required],
      department: ["", Validators.required],
      assembly: ["", Validators.required],
      machine: ["", Validators.required],
      from: [this.selection.getDate(), Validators.required],
      to: ["", Validators.required],
      interval: '1',
      reportName: [""],
      shift: [[]],
      filterType: [""]
    });
    this.fromStartAt = this.selection.getDate();
    this.toStartAt = this.selection.getDate(true);
    this.config.getreportDetails(0, 0).subscribe(data => {
      this.reportOptions = data
    });
    // this.reportOptions  = [];
  }

  ngOnInit() {
    this.showTime = "both";
    this.storageServiceService.setStorageItem(DATA.LAST_ACTION, Date.now().toString());
    this.reportName = this.type;
    this.setIntervalField(this.type);
    this.selection
      .getPlant()
      .subscribe(
        data => {
          if (data != null) {
            this.plantOptions = data
          } else {
            this.plantOptions = null;
            this.report.get('plant').setValue('');
            this.snack.open('No More Plant', 'ok', {
              duration: 5000
            });
          }
        },
        err => this.handleError(err)
      );

    if (this.page === 'reportview') {
      this.showReportView = true;
      this.showShift = true;

      this.config.getShiftDetails(0, 0).subscribe(
        data => (this.shifts = data),
        err => this.handleError(err));

    }

    if (this.page === 'reportOee') {
      this.showShift = false;
      this.showInterval = true;
      this.config.getShiftDetails(0, 0).subscribe(
        data => (this.shifts = data),
        err => this.handleError(err));
      this.showShift = true;
      this.showOeeInterval = true;
      this.intervalField = false;
    } else {
      this.showOeeInterval = false;
    }

  }

  onReport(event: any) {
    this.showTime = 'both';
    this.intervalField = true;
    this.intervalForDynamic = false;
    if (event.filter_type === 'shift') {
      this.showShift = true;
      this.showTime = 'calendar';
      this.intervalField = false;
      this.intervalForDynamic = true;
      this.report.controls['interval'].setValue(event.interval);
    } else {
      this.showShift = false;
    }
    this.config.getreportDetails(0, 0).subscribe(data => {
      let ob = data.find((p) => { return p.report_id === event.report_id });
      this.type = ob.machine_type;
    });

    this.report.get('plant').setValue('');
    this.report.get('department').setValue('');
    this.report.get('assembly').setValue('');
    this.report.get('machine').setValue('');
    this.report.get('filterType').setValue(event.filter_type);
  }

  onChange(event: number) {
    this.insight.department = -0;
    this.insight.assembly = -0;
    this.insight.machine = -0;
    this.insight.plant = event;
    this.selection.getDept(event).subscribe(data => {
      if (data != null) {
        this.deptOptions = data;
      }
      else {
        this.deptOptions = null;
        this.report.get('department').setValue('');
        this.snack.open('This Plant does not have Departments', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }

  onChangeDepartment(event: number) {
    this.insight.assembly = -0;
    this.insight.machine = -0;
    this.insight.department = event;
    this.selection
      .getAssembly(event)
      .subscribe(data => {
        if (data != null) {
          this.assemblyOptions = data;
        } else {
          this.assemblyOptions = null;
          this.report.get('assembly').setValue('');
          this.snack.open('This Department does not have Assemblys', 'ok', {
            duration: 5000
          });
        }
      }, err => this.handleError(err));
  }

  onChangeAssembly(event: number) {
    this.insight.machine = -0;
    this.insight.assembly = event;
    this.selection
      .getMachineNames(
        this.insight.plant,
        this.insight.department,
        this.insight.assembly,
        this.type,
        this.flag
      ) 
      .subscribe(data => {
        if (data != null) {
          this.machineOptions = data;
        }
        else {
          this.machineOptions = null;
          this.report.get('machine').setValue('');
          this.snack.open('This Assembly does not have Machine', 'ok', {
            duration: 5000
          });
        }
      }, err => this.handleError(err));
  }

  onSelect(event: number) {
    this.machineId = event;
  }

  onGenerate(downloadPdfBtnRef) {
    if (this.report.valid) {
      this.passFormValues(this.report.value, downloadPdfBtnRef);
    }
  }

  onDownloadPDF(downloadPdfBtnRef) {
    alert('test btn work');
  }

  passFormValues(reportValue, downloadPdfBtnRef) {

    if (this.type == this.reportType) {
      const { assembly, department, plant, machine, ...rest } = reportValue;
      let values = {
        assembly: this.getValue(this.assemblyOptions, assembly).assemblyName,
        department: this.getValue(this.deptOptions, department).deptName,
        machine: this.getValue(this.machineOptions, machine).machineName,
        plant: this.getValue(this.plantOptions, plant).plantName,
        ...rest
      };
      this.select.emit({ reportValue, values, downloadPdfBtnRef });
    } else {
      const { assembly, department, plant, machine, ...rest } = reportValue;
      let values = {
        assembly: this.getValue(this.assemblyOptions, assembly).assemblyName,
        department: this.getValue(this.deptOptions, department).deptName,
        machine: this.getValue(this.machineOptions, machine).machineName,
        plant: this.getValue(this.plantOptions, plant).plantName,
        ...rest
      };
      this.select.emit({ reportValue, values, downloadPdfBtnRef });
    }
 
  }

  private getValue = (collection: string[], id): any =>
    collection.find((opt: any) => opt.id === id);

  ondatechange() {
    this.showShift = false;
    if (this.report.get("from").value && this.report.get("to").value) {
      var date1 = this.report.get("from").value;
      var date2 = this.report.get("to").value;
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var diffDays = Math.round(
        Math.abs((date1.getTime() - date2.getTime()) / oneDay)
      );
      if (diffDays > 1) {
        this.show = false;
      } else {
        this.show = true;
      }
    }
  }

  ShowShift() {
    this.showShift = false;
    if (this.report.get('interval').value != 'Day') {
      this.showShift = false;
    }
    else {
      this.showShift = true;
    }
  }

  setMinToDate() {
    const { from } = this.report.value;
    this.min = from;
  }

  private handleError(err) {
    this.error.handleError(err);
  }

  private setIntervalField(type) {
    if (type.toUpperCase() === "MACHINE_REPORT" || type.toUpperCase() === "ALARM_REPORT")
      this.report.controls['interval'].disable();
  }

}

class Insight {
  plant: number;
  department: number;
  assembly: number;
  machine: number;
}