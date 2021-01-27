import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';

import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';

@Component({
  selector: 'app-time-slot-dialog',
  templateUrl: './time-slot-dialog.component.html',
  styleUrls: ['./time-slot-dialog.component.scss']
})
export class TimeSlotDialogComponent {
  timeslot: FormGroup;
  loading: boolean;
  constructor(
    private _dialogRef: MatDialogRef<TimeSlotDialogComponent>,
    private _fb: FormBuilder,
    private _config: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.timeslot = this._fb.group({
      timeslot_id: '',
      reason: ['', Validators.required]
    });
    this.timeslot.controls['timeslot_id'].setValue(Number(this.dialog.details.timeslot_id));
    this.timeslot.controls['reason'].setValue(this.dialog.details.reason);
  }
  onSubmit() {
    if (this.timeslot.valid) {
      this.update(this.timeslot.value, this.dialog.mode);
    }
  }

  update(timeslot, mode) {
    this.timeslot.disable();
    this.loading = true;
    switch (mode) {
      case MODE.UPDATE:
        this._config
          .updateSlotData(timeslot)
          .subscribe(
          resp => this._dialogRef.close(resp),
          err => this.handleError(err)
          );
        break;
      default:
        return;
    }
  }

  private handleError(err) {
    this._config.throwError(err);
    this.timeslot.enable();
    this.loading = false;
  }
}
