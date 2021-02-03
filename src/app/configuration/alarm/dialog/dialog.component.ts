import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  FormGroup, FormBuilder ,Validators } from '@angular/forms';

import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  alarm: FormGroup;
  alrams: string[] = ALARM_LIST;
  alramTypes: string[] = ALARM_TYPES;
  loading: boolean;

  constructor(
    private _dialogRef: MatDialogRef<DialogComponent>,
    private _fb: FormBuilder,
    private _alarm: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.alarm = this._fb.group({
      alarmId: '',
      alarmName: ['', Validators.required],
      alarmType: ['', Validators.required],
      repetition: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      action: ['', [Validators.required, Validators.pattern("^.*\\S.*[A-Za-z]+$")]]
    });
    if (dialog.mode === MODE.UPDATE) {
      this.alarm.setValue(dialog.details);
    };
  }



  onSubmit() {
    if (this.alarm.valid) {
      this.update(this.alarm.value, this.dialog.mode);
    }
  }

  update(alarm, mode) {
    this.alarm.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._alarm
          .addAlarm(alarm)
          .subscribe(
            newAlarm => this._dialogRef.close(newAlarm),
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this._alarm
          .updateAlarm(alarm)
          .subscribe(
            res => this._dialogRef.close(alarm),
            err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._alarm
          .deleteAlarm(alarm.alarmId)
          .subscribe(
            res => this._dialogRef.close(alarm),
            err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this._alarm.throwError(err);
    this.alarm.enable();
    this.loading = false;
  }
}

const ALARM_LIST = [
  'High Current',
  'High Temprature',
  'Low Temprature',
  'System Failure'
];

const ALARM_TYPES = ['Critical', 'Medium', 'Severe', 'Low'];
