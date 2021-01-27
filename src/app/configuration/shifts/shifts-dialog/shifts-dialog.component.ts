import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from "@angular/material";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from "moment";

import { ConfigurationService } from "../../configuration.service";
import { MODE } from "../../shared/config";
import { Shift } from "../../shared/shift";

const BREAK_DATA: any[] = [];
@Component({
  selector: 'app-shifts-dialog',
  templateUrl: './shifts-dialog.component.html',
  styleUrls: ['./shifts-dialog.component.scss']
})
export class ShiftsDialogComponent {
  minBreak;
  maxBreak;
  minBreakTo;

  showShift: boolean = false;
  showDelete: boolean = false;
  showBreak: boolean = false;
  showUpdateBreak: boolean = false;
  loading: boolean;
  shift: FormGroup;
  breaks: FormGroup;
  title: string = "";
  valid: boolean;

  displayedColumns: string[] = ['select', 'breakType', 'breakFrom', 'breakTo'];
  dataSource = new MatTableDataSource<any>();
  disable: boolean;
  selection = new SelectionModel<any>(true, []);
  reportId: number;
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private dialogRef: MatDialogRef<ShiftsDialogComponent>,
    private fb: FormBuilder,
    private _shift: ConfigurationService
  ) {

    this.shift = this.fb.group({
      shiftid: "",
      shiftName: ["", Validators.required],
      shiftFrom: ["", Validators.required],
      shiftTo: ["", Validators.required],
      breaks: this.fb.array([])
    });
    this.breaks = this.fb.group({
      breakid: "",
      breakType: ["", Validators.required],
      breakFrom: ["", Validators.required],
      breakTo: ["", Validators.required],
    });
    this.getTemplate(this.dialog.mode, this.dialog.type);
  }

  private validateBreakPicker() {
    this.minBreak = this.shift.value.shiftFrom;
    this.maxBreak = this.shift.value.shiftTo;
    this.minBreakTo = this.minBreak;
  }
  setMinToBreakTime() {
    this.minBreakTo = this.breaks.get('breakFrom').value;
    this.breaks.controls['breakTo'].markAsTouched();
  }

  getTemplate(mode, type) {

    if (this.dataSource.data.length != 0) {
      while (this.dataSource.data.length > 0) {
        this.dataSource.data.pop();
      }
    } //empty 
    if (BREAK_DATA.length != 0) {
      while (BREAK_DATA.length > 0) {
        BREAK_DATA.pop();
      }
    } //empty 

    if ((mode === 'add') && (type === 'shifts')) {
      this.showShift = true;
    }
    if ((mode === 'edit') && (type === 'shifts')) {

    
      this.showShift = true;
      this.shift.controls['shiftid'].setValue(Number(this.dialog.details.shiftid));
      this.shift.controls['shiftName'].setValue(this.dialog.details.shiftName);
      this.shift.controls['shiftFrom'].setValue(this._shift.getTimeData(this.dialog.details.shiftFrom));
      this.shift.controls['shiftTo'].setValue(this._shift.getTimeData(this.dialog.details.shiftTo));
    }

    if ((mode === 'add') && (type === 'breaks')) {
      this.shift.controls['shiftFrom'].setValue(this._shift.getTimeData(this.dialog.details.shiftFrom));
      this.shift.controls['shiftTo'].setValue(this._shift.getTimeData(this.dialog.details.shiftTo));
      this.validateBreakPicker();
      this.showBreak = true;
    }

    if ((mode === 'edit') && (type === 'breaks')) {
 
      this.shift.controls['shiftFrom'].setValue(this._shift.getTimeData(this.dialog.details.shiftFrom));
      this.shift.controls['shiftTo'].setValue(this._shift.getTimeData(this.dialog.details.shiftTo));
      this.breaks.controls['breakid'].setValue(Number(this.dialog.details.breaks.breakid));
      this.breaks.controls['breakType'].setValue(this.dialog.details.breaks.breakType);
      this.breaks.controls['breakFrom'].setValue(this._shift.getTimeData(this.dialog.details.breaks.breakFrom));
      this.breaks.controls['breakTo'].setValue(this._shift.getTimeData(this.dialog.details.breaks.breakTo));
      this.validateBreakPicker();
      this.showUpdateBreak = true;
    }

    if ((mode === 'delete')) {
      this.showDelete = true;
      if (type === 'shifts') {
        this.title = this.dialog.details.shiftName + ' shift';
      } else {
        this.title = this.dialog.details.breakType + ' break';
      }
    }

  }

  addBreaks() {
    this.validationOfName(this.breaks.value);
    if (this.breaks.valid) {
      this.breaks.controls['breakFrom'].setValue(this._shift.formatDate(this.breaks.get('breakFrom').value));
      this.breaks.controls['breakTo'].setValue(this._shift.formatDate(this.breaks.get('breakTo').value));
      BREAK_DATA.push(this.breaks.value);
      this.dataSource = new MatTableDataSource(BREAK_DATA);
      this.breaks.controls['breakType'].setValue('');
      this.breaks.controls['breakFrom'].setValue('');
      this.breaks.controls['breakTo'].setValue('');
      if (this.dataSource.data.length == 0) {
        this.valid = false;
      }
      else {
        this.valid = true;
      }

    }

  }

  removeBreaks() {
    this.selection.selected.forEach(item => {
      const index: number = BREAK_DATA.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1); //restored parameters list
      BREAK_DATA.splice(index, 1);
      this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
    });
    if (this.dataSource.data.length == 0) {
      this.valid = false;
    }
    else {
      this.valid = true;
    }

  }

  validationOfName(value) {
    
    if ((this.dialog.mode === 'add') && (this.dialog.type === 'shifts')) {
      if (this.dialog.details != null) {
        for (let key of this.dialog.details) {
          if (key.shiftName === value.shiftName) {
            this.shift.controls['shiftName'].setErrors({ 'incorrect': true });
            break;
          }
        }
      }
    }

    if ((this.dialog.mode === 'edit') && (this.dialog.type === 'shifts')) {
      let compare = [];
      for (let key of this.dialog.allData) {
        if (this.dialog.details.shiftName !== key.shiftName) {
          compare.push(key.shiftName);
        }
      }
      for (let key of compare) {
        if (key === value.shiftName) {
          this.shift.controls['shiftName'].setErrors({ 'incorrect': true });
          break;
        }
      }
    }

    if ((this.dialog.mode === 'add') && (this.dialog.type === 'breaks')) {
    
      let compare = [];
      for (let key of this.dialog.details.breaks) {
        compare.push(key.breakType);
      }
      if (this.dataSource.data != null) {
        for (let key of this.dataSource.data) {
          compare.push(key.breakType);
        }
      }

      for (let key of compare) {
        if (key === value.breakType) {
          this.breaks.controls['breakType'].setErrors({ 'incorrect': true });
          break;
        }
      }
      if (this.breaks.valid) {
        this.valid = true;
      }
    }

    if ((this.dialog.mode === 'edit') && (this.dialog.type === 'breaks')) {
      let compare = [];
      for (let key of this.dialog.allData) {
        if (key.breakid !== value.breakid) {
          compare.push(key.breakType);
        }
      }
      for (let key of compare) {
        if (key === value.breakType) {
          this.breaks.controls['breakType'].setErrors({ 'incorrect': true });
          break;
        }
      }
      if (this.breaks.valid) {
        this.valid = true;
      }
    }

  }

  onShiftSubmit(value) {
    this.validationOfName(value);
    if (this.shift.valid) {
      this.update(value, this.dialog.mode, this.dialog.type);
    }
  }

  onBreakSubmit(value) {
    this.validationOfName(value);
    if (this.valid) {
      this.update(value, this.dialog.mode, this.dialog.type);
    }
  }

  update(req: any, mode: string, type: string) {
    this.shift.disable();
    this.breaks.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._shift.addShiftOrBreak(req, mode, type, this.dialog.details).subscribe(
          resp => { this.dialogRef.close(resp); },
          err => this.handleError(err)
        );
        break;
      case MODE.UPDATE:
        {
          this._shift.updateShiftOrBreak(req, mode, type).subscribe(
            resp => { this.dialogRef.close(resp); },
            err => this.handleError(err)
          );
        }
        break;
      case MODE.DELETE:
        this._shift.deleteShiftOrBreak(req, type).subscribe(
          resp => { this.dialogRef.close(resp); },
          err => this.handleError(err)
        );
        break;
      default:
        return;
    }
  }

  private handleError(err) {
    this._shift.throwError(err);
    this.shift.enable();
    this.loading = false;
  }





}
