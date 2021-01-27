import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurationService } from '../configuration.service';
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { AutoLogoutService } from "../../auto-logout.service";
import * as moment from "moment";
import { DATA } from "src/app/core/data.enum";
import { StorageServiceService } from "src/app/core/services/auth/storage-service.service";

@Component({
  selector: 'report-form',
  templateUrl: './config-filter-form.component.html',
  styleUrls: ['./config-filter-form.component.scss']
})
export class ConfigFilterFormComponent {
  @Output()
  select = new EventEmitter();
  @Input() type: string;

  report: FormGroup;

  plantOptions = [];
  deptOptions = [];
  assemblyOptions = [];
  machineOptions = [];

  insight: Insight = new Insight();

  fromStartAt;
  toStartAt;

  max: Date = new Date();
  min: Date = new Date();
 
 
  shifts: any[] = [];
  showShift: boolean = false;
  intervalField: boolean = true;
  showTime: string;
  showInterval: boolean;
  oeeFrom: any;
  edit: any;
  constructor(
    private error: GlobalErrorHandler,
    private fb: FormBuilder,
    private selection: ConfigurationService,
    private logout: AutoLogoutService,
    private snack: MatSnackBar,
    private storageServiceService: StorageServiceService
  ) {
    this.report = this.fb.group({
      plant: ["", Validators.required],
      department: ["", Validators.required],
      assembly: ["", Validators.required],
      machineId: ["", Validators.required],
      from: [this.selection.getDate(), Validators.required],
      to: ["", Validators.required]
    });
    this.fromStartAt = this.selection.getDate();
    this.toStartAt = this.selection.getDate(true);
  }
 
  ngOnInit() {
    this.showTime = "both";
    this.storageServiceService.saveStorage(DATA.LAST_ACTION, Date.now().toString());
    this.selection
      .getPlant()
      .subscribe(
        data => (this.plantOptions = data),
        err => this.handleError(err)
      );

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
      .getIdWiseAssembly(event)
      .subscribe(data => {
        if (data != null) {
          this.assemblyOptions = data;
        }
        else {
          this.assemblyOptions = null;
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
        this.type
      )
      .subscribe(data => {
        if (data != null) {
          this.machineOptions = data;
        }
        else {
          this.machineOptions = null;
          this.snack.open('This Assembly does not have Machine', 'ok', {
            duration: 5000
          });
        }
      }, err => this.handleError(err));
  }

  onGenerate() {
    if (this.report.valid) {
      this.passFormValues(this.report.value);
    }
  }


  passFormValues(reportValue) {
    const { assembly, department, plant, machineId, ...rest } = reportValue;
    this.select.emit({ reportValue });
  }


  setMinToDate() {
    const { from } = this.report.value;
    this.min = from;
  }

  private handleError(err) {
    this.error.handleError(err);
  }

}
class Insight {
  plant: number;
  department: number;
  assembly: number;
  machine: number;
}