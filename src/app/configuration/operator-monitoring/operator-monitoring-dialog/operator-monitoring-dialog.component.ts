import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';

@Component({
  selector: 'app-operator-monitoring-dialog',
  templateUrl: './operator-monitoring-dialog.component.html',
  styleUrls: ['./operator-monitoring-dialog.component.scss']
})
export class OperatorMonitoringDialogComponent {
  operator: FormGroup;
  loading: boolean;
  date:string='calendar';
  users: any = [];
  shifts: any = [];
  machines: any = [];

  editUser: any;
  editShift: any;
  editMachine: any;

  constructor(
    private _dialogRef: MatDialogRef<OperatorMonitoringDialogComponent>,
    private _fb: FormBuilder,
    private _operator: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.operator = this._fb.group({
      operator_id: '',
      user_detail: ['', Validators.required],
      shift_detail: ['', Validators.required],
      machine_detail: ['', Validators.required],
      day: ['', Validators.required]
    });

    this._operator.getUserDetails(0, 0).subscribe(data =>{
       this.users = data;
       this.editUser = this.dialog.details.user_detail;
       this.compareUser(this.users, this.editUser);
      }, err => this.handleError(err));

    this._operator.getShiftDetails(0, 0).subscribe(data => {
      this.shifts = data;
      this.editShift = this.dialog.details.shift_detail;
      this.compareShift(this.shifts, this.editShift);
    }, err => this.handleError(err));

    this._operator.OldgetMachineDetails(0, 0).subscribe(data => {
      for(let key of data){
        if(key.machineType==='production'){
          this.machines.push(key);
        }
      }
      this.editMachine = this.dialog.details.machine_detail;
      this.compareMachine(this.machines, this.editMachine);
    }, err => this.handleError(err));
    
    if (this.dialog.mode === 'edit') {
      this.operator.controls['operator_id'].setValue(this.dialog.details.operator_id);
      this.operator.controls['day'].setValue(this.dialog.details.day);
    }
  }

  validation() {
    let date = this._operator.formatDateOperator(this.operator.get('day').value);
    let machine = this.operator.get('machine_detail').value;
    let shift = this.operator.get('shift_detail').value;
    if (this.dialog.mode === 'assign') {
      for (let key of this.dialog.allData) {
        if (date === key.day) {
          if ((machine.id === key.machine_detail.id) && (shift.shiftid === key.shift_detail.shiftid)) {
            this.operator.controls['day'].setErrors({ 'incorrect': true });
          }
        }
      }
    } else {
      for (let key of this.dialog.allData) {
        if (this.dialog.details.operator_id !== key.operator_id) {
          if (date === key.day) {
            if ((machine.id === key.machine_detail.id) && (shift.shiftid === key.shift_detail.shiftid)) {
              this.operator.controls['day'].setErrors({ 'incorrect': true });
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.validation();
    if (this.operator.valid) {
      this.operator.controls['day'].setValue(this._operator.formatDateOperator(this.operator.get('day').value));
      this.update(this.operator.value, this.dialog.mode);
    }
  }

  update(operator, mode) {
    this.operator.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ASSIGN:
        this._operator
          .addOperator(operator)
          .subscribe(
          resp => this._dialogRef.close(resp),
          err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this._operator
          .updateOperator(operator)
          .subscribe(
          resp => this._dialogRef.close(resp),
          err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._operator
          .deleteOperator(operator.operator_id)
          .subscribe(
          res => this._dialogRef.close(operator),
          err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this._operator.throwError(err);
    this.operator.enable();
    this.loading = false;
  }


  compareUser(param1: any, param2: any) {
    return param1 && param2 ? param1.id === param2.id : param1 === param2;
  }
  compareShift(param1: any, param2: any) {
    return param1 && param2 ? param1.shiftid === param2.shiftid : param1 === param2;
  }
  compareMachine(param1: any, param2: any) {
    return param1 && param2 ? param1.id === param2.id : param1 === param2;
  }

}
