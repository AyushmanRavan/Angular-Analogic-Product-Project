import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators,FormBuilder} from '@angular/forms';
import { ReportsService } from "../../../reports.service";
import { MODE } from '../../../../configuration/shared/config'

@Component({
  selector: 'app-machine-maintenance-dialog',
  templateUrl: './machine-maintenance-dialog.component.html',
  styleUrls: ['./machine-maintenance-dialog.component.scss']
})
export class MachineMaintenanceDialogComponent{
  maintenance: FormGroup;
  loading: boolean;
  constructor(
    private _dialogRef: MatDialogRef<MachineMaintenanceDialogComponent>,
    private _fb: FormBuilder,
    private _maintenance: ReportsService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.maintenance = this._fb.group({
      maintenanceId:'',
      machine:'',
      maintenance_date:['', Validators.required],
      maintenance_hours:'',
      remaining_hours:''
    });
    this.maintenance.controls['maintenanceId'].setValue(Number(this.dialog.details.maintenanceId));
    this.maintenance.controls['machine'].setValue(this.dialog.details.machine.machineName);
    this.maintenance.controls['maintenance_date'].setValue(new Date(this.dialog.details.maintenance_date));
  }

  onSubmit() {
    if (this.maintenance.valid) {
      let formValue=Object(this.maintenance.value);
      formValue.maintenance_date=this._maintenance.formatDate(formValue.maintenance_date);
      delete formValue.machine;
      delete formValue.maintenance_hours;
      delete formValue.remaining_hours;
      this.update(formValue, this.dialog.mode);
    }
  }

  update(maintenance, mode) {
    this.maintenance.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._maintenance
          .addMaintenance(maintenance)
          .subscribe(
            newAlarm => this._dialogRef.close(newAlarm),
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this._maintenance
          .updateMaintenance(maintenance)
          .subscribe(
            res => this._dialogRef.close(maintenance),
            err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this._maintenance.throwError(err);
    this.maintenance.enable();
    this.loading = false;
  }
}
