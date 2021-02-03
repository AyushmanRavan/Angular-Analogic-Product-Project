import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';

@Component({
  selector: 'app-associated-machine-dialog',
  templateUrl: './associated-machine-dialog.component.html'

})
export class AssociatedMachineDialogComponent {
  machine: FormGroup;
  loading: boolean;
  constructor(
    private _dialogRef: MatDialogRef<AssociatedMachineDialogComponent>,
    private _fb: FormBuilder,
    private _machine: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.machine = this._fb.group({
      plant: [0, Validators.required],
      department: [0, Validators.required],
      assembly: [0, Validators.required],
      machine: [0, Validators.required],
    });
  }

  onSubmit() {
    if (this.machine.valid) {
      this.update(this.machine.value, this.dialog.mode);
    }
  }

  update(machine, mode) {
    this.machine.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._machine
          .addAssociatedMachine(machine)
          .subscribe(
            resp => this._dialogRef.close(resp),
            err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._machine
          .deleteAssociatedMachine(machine.associated_id)
          .subscribe(
            res => this._dialogRef.close(machine),
            err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this._machine.throwError(err);
    this.machine.enable();
    this.loading = false;
  }
}
