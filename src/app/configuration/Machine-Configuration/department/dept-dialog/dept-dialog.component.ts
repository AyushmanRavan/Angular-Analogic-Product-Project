import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder,  Validators } from '@angular/forms';

import { ConfigurationService } from '../../../configuration.service';
import { MODE } from '../../../shared/config';
import { cloneDeep } from "lodash";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dept-dialog',
  templateUrl: './dept-dialog.component.html',
  styleUrls: ['./dept-dialog.component.scss']
})
export class DeptDialogComponent implements OnInit {
  isTypeDisabled = false;
  hide = false;
  invalid = false;
  selectedAssociatedDepartment;
  selectedType;
  disabledAlarm = false;
  disabledDataAvailable = false;
  check;
  list = [];
  groups;
  hiddencol = false;
  AssosiateTypes;
  isDataAvailable = false;
  associtiveDepartment;
  deptOption;
  plantOption;
  type = 'department';
  machineTypes;
  department: FormGroup;
  loading: boolean;
  plants;
  constructor(
    private _dialogRef: MatDialogRef<DeptDialogComponent>,
    private _fb: FormBuilder,
    private _depart: ConfigurationService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dialog: any
  ) {
    this.department = this._fb.group({
      departmentId: "",
      name: ["", Validators.required],
      assosiativeName: ["", Validators.required],
      plantId: ["", Validators.required],
      ppm: ["", [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"), Validators.min(0)]],
      maintenance: [""],
      sequenceNumber: ["", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      type: ["", Validators.required],
      pgIds: [""],
      cbmParameter: "",
      alarm: [false],
      dataAvailable: [false]
    });
    if (dialog.mode === MODE.UPDATE) {
      if (dialog.mode === MODE.UPDATE) {
        this.disabledAlarm = this.dialog.details.alarm === true ? true : false;
        if (this.dialog.details.dataAvailable === true) {
          this.disabledDataAvailable = true;
          this.isDataAvailable = true;
          this.invalid = true;
          this.isTypeDisabled = true;
        } else {
          this.disabledDataAvailable = false;
          this.isDataAvailable = false;
          this.invalid = false;
          this.department.controls['pgIds'].clearValidators();
          this.department.controls['pgIds'].updateValueAndValidity();
          this.isTypeDisabled = false;
        }
        this.disabledDataAvailable = this.dialog.details.dataAvailable === true ? true : false;
        this.isDataAvailable = this.dialog.details.dataAvailable === true ? true : false;
        this.selectedAssociatedDepartment = this.dialog.details.assosiativeName;
        this.department.get('assosiativeName').clearValidators();
        this.department.controls["name"].setValue(this.dialog.details.departmentName);
        this.department.controls["type"].setValue(this.dialog.details.machineType);
        this.department.controls["sequenceNumber"].setValue(Number(this.dialog.details.sequenceNumber));
        this.department.controls["departmentId"].setValue(Number(this.dialog.details.departmentId));
        this.department.controls["pgIds"].setValue(this.dialog.details.pgIds);
        this.department.controls["cbmParameter"].setValue(this.dialog.details.cbmParameter);
        this.department.controls["alarm"].setValue(this.dialog.details.alarm);
        this.department.controls['dataAvailable'].setValue(this.dialog.details.dataAvailable);
        this.department.controls["plantId"].setValue(Number(this.dialog.details.plantId));
        this.hide = true;
        this.department.enable();
        this.loading = false;
        if (this.dialog.details.machineType === 'production') {
          this.hiddencol = true;
          if (this.dialog.details.cbmParameter.length > 0) {
            this.department.controls["ppm"].setValue(Number(this.dialog.details.cbmParameter[0].value));
            this.department.controls["maintenance"].setValue(Number(this.dialog.details.cbmParameter[1].value));
          }
        }
      }
    }
  }
  ngOnInit() {
    this._depart.getPlants(0, 0).subscribe(data => {
      this.plantOption = data;
    });
    this._depart.getAssocitiveMachine(this.type).subscribe(data => {
      if (data != null) {
        this.associtiveDepartment = data;
      } else {
        this.snack.open('No Associtive Name', 'ok', { duration: 5000 });
      }
    }, err => this.handleError(err));
    this._depart.getMachineType().subscribe(data => {
      this.machineTypes = data;
    });
    this._depart.getParameterGroup().subscribe(data => {
      if (data != null) {
        this.groups = data;
      } else {
        this.snack.open('No Parameter Group', 'ok', { duration: 5000 });
      }
    }, err => this.handleError(err));
  }
  onChange(event, checkboxName) {
    if (checkboxName === 'dataAvailable') {
      this.isDataAvailable = !this.isDataAvailable;
      if (this.isDataAvailable === true) {
        this.department.controls['pgIds'].setValidators(Validators.required);
        this.department.controls['pgIds'].updateValueAndValidity();
      } else {
        this.department.controls['pgIds'].clearValidators();
        this.department.controls['pgIds'].updateValueAndValidity();
      }
    }
    
  }
  onTypeChange() {
    this.hiddencol = false;
    const selectedType = this.department.get('type').value;
    if (selectedType === 'production') {
      this.hiddencol = true;
    }
  }
  onCheckboxChange(id, event) {
    if (event.target.checked) {
      this.list.push({ id: id, checked: event.target.checked });
    } else {
      for (let i = 0; i <= this.list.length; i++) {
        if (this.list[i].id === id) {
          this.list.splice(i, 1);
        }
      }
    }
    // check list  is empty or not(validation for checkboxes)
    if (Array.isArray(this.list) && this.list.length) {
      this.check = false;
    } else {
      this.department.controls['pgIds'].setErrors({ 'incorrect': true });
      this.check = true;
    }
  }
  onSubmit() {
    if (this.department.valid) {
      this.update(this.department.value, this.dialog.mode);
    }
  }

  update(parameter, mode) {
    let tempData = Object.assign({}, parameter);

    if (tempData['type'] === 'production') {
      let param = [{ 'id': null, "name": "ppm", "value": parseFloat(parameter.ppm), "data_type": "float", "unit": "pkts" },
      { 'id': null, "name": "maintenanceHours", "value": parameter.maintenance, "data_type": "int", "unit": "hrs" }];
      tempData.cbmParameter = cloneDeep(param);  //copy all cbm param
      // then delete from form 
      delete tempData.ppm;
      delete tempData.maintenance;
    } else {
      tempData.cbmParameter = [];
      // then delete from form 
      delete tempData.ppm;
      delete tempData.maintenance;
    }
    let list;
    if(this.dialog.mode === MODE.ADD){
      list = this.list.map(a => a.id);
    }else{
      if(this.dialog.mode === MODE.UPDATE){
        if (tempData['pgIds'] === true){
          list = this.list.map(a => a.id);
        }else {
          list = this.dialog.details.pgIds.map(a => a);
        }
      }
    }
    tempData.pgIds = cloneDeep(list);
    this.department.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._depart.addMachines(tempData).subscribe(data => {
          this._dialogRef.close(data);
        }, err => this.handleError(err));
        break;


      case MODE.UPDATE:
        tempData['assosiativeName'] = this.selectedAssociatedDepartment;
        this._depart.updateMachines(tempData).subscribe(data => {
          this._dialogRef.close(data);
        }, err => this.handleError(err));
        break;

      case MODE.DELETE:
        this._depart.deleteMachine(tempData.departmentId, this.type).subscribe(
          res => this._dialogRef.close(parameter),
          err => this.handleError(err));
        break;
      default:
        return;
    }
  }

  private handleError(err) {
    this._depart.throwError(err);
    this.department.enable();
    this.loading = false;
  }
}




