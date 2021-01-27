import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MODE } from "./../../../shared/config";
import { ConfigurationService } from "./../../../../configuration/configuration.service";
import { switchMap } from "rxjs/operators";
import { cloneDeep } from "lodash";

@Component({
  selector: 'app-assembly-dialog',
  templateUrl: './assembly-dialog.component.html',
  styleUrls: ['./assembly-dialog.component.scss']
})
export class AssemblyDialogComponent implements OnInit {
  isTypeDisabled = false;
  hide = false;
  invalid = false;
  selectedAssociatedAssembly;
  selectedType;
  disabledAlarm = false;
  disabledDataAvailable = false;
  check;
  list = [];
  groups;
  hiddencol = false;
  AssosiateTypes;
  isDataAvailable = false;
  associtiveAssembly;
  type = 'assembly';
  deptOption;
  plantOption;
  assembly: FormGroup;
  plants: any[];
  depts: any[];
  loading: boolean = true;
  disabled: boolean;
  title: string = "assembly";

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private _formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private _machine: ConfigurationService,
    private _dialogRef: MatDialogRef<AssemblyDialogComponent>
  ) {
    this.assembly = this._formBuilder.group({
      assemblyId: "",
      name: ["", Validators.required],
      assosiativeName: ["", Validators.required],
      plantId: ["", Validators.required],
      departmentId: ["", Validators.required],
      ppm: ["", [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"), Validators.min(0)]],
      maintenance: [""],
      sequenceNumber: ["", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      type: ["", Validators.required],
      pgIds: [""],
      cbmParameter: "",
      alarm: [false],
      dataAvailable: [false]
    });
    this.assembly.disable();

    if (dialog.mode === MODE.ADD) {
      this._machine.getPlants(0, 0).subscribe(data => {
        this.plantOption = data;
        this.loading = false;
        this.assembly.enable();
      }, err => this.handleError(err));

      this._machine.getAssocitiveMachine(this.type).subscribe(data => {
        if (data != null) {
          this.associtiveAssembly = data;
        } else {
          this.snack.open('No Associtive Name', 'ok', { duration: 5000 });
        }
      }, err => this.handleError(err));

      this._machine.getParameterGroup().subscribe(data => {
        if (data != null) {
          this.groups = data;
        } else {
          this.snack.open('No Parameter Group', 'ok', { duration: 5000 });
        }
      }, err => this.handleError(err));
    }


    if (dialog.mode === MODE.DELETE) {
      this.loading = false;
      this.assembly.enable();
    }

    if (dialog.mode === MODE.UPDATE) {
      this.disabledAlarm = this.dialog.details.alarm === true ? true : false;
      
      this.disabledDataAvailable = this.dialog.details.dataAvailable === true ? true : false;
      this.isDataAvailable = this.dialog.details.dataAvailable === true ? true : false;
      this.selectedAssociatedAssembly = this.dialog.details.assosiativeName;
      this.assembly.get('assosiativeName').clearValidators();
      this.assembly.controls["name"].setValue(this.dialog.details.assemblyName);
      this.assembly.controls["type"].setValue(this.dialog.details.machineType);
      this.assembly.controls["sequenceNumber"].setValue(Number(this.dialog.details.sequenceNumber));
      this.assembly.controls["assemblyId"].setValue(Number(this.dialog.details.assemblyId));
      this.assembly.controls["pgIds"].setValue(this.dialog.details.pgIds);
      this.assembly.controls["cbmParameter"].setValue(this.dialog.details.cbmParameter);
      this.assembly.controls["alarm"].setValue(this.dialog.details.alarm);
      this.assembly.controls['dataAvailable'].setValue(this.dialog.details.dataAvailable)
      this.assembly.controls["plantId"].setValue(Number(this.dialog.details.plantId));
      //mthis.assembly.controls["departmentId"].setValue(Number(this.dialog.details.departmentId));

      this._machine.getPlants(0, 0).subscribe(data => {
        this.plantOption = data;
      this.assembly.controls["plantId"].setValue(Number(this.dialog.details.plantId));
      }, err => this.handleError(err));

      this._machine.getDept(this.dialog.details.plantId).subscribe(data => {
        this.deptOption = data;
        this.assembly.controls["departmentId"].setValue(Number(this.dialog.details.departmentId));
      }, err => this.handleError(err));

      this._machine.getParameterGroup().subscribe(data => {
        if (data != null) {
          this.groups = data;
        } else {
          this.snack.open('No Parameter Group', 'ok', { duration: 5000 });
        }
      }, err => this.handleError(err));
      this.hide = true;
     this.assembly.enable();
      this.loading = false;
      if (this.dialog.details.machineType == 'production') {
        this.hiddencol = true;
        if (this.dialog.details.cbmParameter.length > 0) {
          this.assembly.controls["ppm"].setValue(Number(this.dialog.details.cbmParameter[0].value));
          this.assembly.controls["maintenance"].setValue(Number(this.dialog.details.cbmParameter[1].value));
        }
      }
      if (this.dialog.details.dataAvailable === true) {
        this.disabledDataAvailable = true;
        this.isDataAvailable = true;
        this.invalid = true;
        this.isTypeDisabled = true;
      } else {
        this.disabledDataAvailable = false;
        this.isDataAvailable = false;
        this.invalid = false;
        this.isTypeDisabled = false;
        this.assembly.controls['pgIds'].clearValidators();
        this.assembly.controls['pgIds'].updateValueAndValidity();
      }
    }
  }

  onAssemblySubmit() {
    if (this.assembly.valid) {
      this.update(this.assembly.value, this.dialog.mode);
    }
  }
  onChange(event, checkboxName) {
    if (checkboxName === 'dataAvailable') {
      this.isDataAvailable = !this.isDataAvailable;
      if (this.isDataAvailable === true) {
        this.assembly.controls['pgIds'].setValidators(Validators.required);
        this.assembly.controls['pgIds'].updateValueAndValidity();
      } else {
        this.assembly.controls['pgIds'].clearValidators();
        this.assembly.controls['pgIds'].updateValueAndValidity();
      }
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
      this.assembly.controls['pgIds'].setErrors({ 'incorrect': true });
      this.check = true;
    }
  }
  update(parameter, mode) {

    let tempData = Object.assign({}, parameter);
    if (tempData['type'] === 'production') {
      // add cbm paramaters 
      let param = [{ 'id': null, "name": "ppm", "value": parseFloat(parameter.ppm), "data_type": "float", "unit": "pkts" },
      { 'id': null, "name": "maintenanceHours", "value": parameter.maintenance, "data_type": "int", "unit": "hrs" }];
      tempData.cbmParameter = cloneDeep(param);  // copy all cbm param
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
    this.assembly.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._machine.addMachines(tempData).subscribe(data => {
          this._dialogRef.close(data);
        }, err => this.handleError(err));
        break;

      case MODE.UPDATE:
        tempData['assosiativeName'] = this.selectedAssociatedAssembly;
        this._machine.updateMachines(tempData).subscribe(data => {
          this._dialogRef.close(data);
        }, err => this.handleError(err));
        break;

      case MODE.DELETE:
        this._machine.deleteMachine(tempData.assemblyId, this.type).subscribe(
          res => this._dialogRef.close(parameter),
          err => this.handleError(err));
        break;
      default:
        return;
    }
  }

  private handleError(err) {
    this._machine.throwError(err);
    this.assembly.enable();
    this.loading = false;
  }
  ngOnInit() {
    this._machine.getMachineType().subscribe(data => {
      this.AssosiateTypes = data;
    });
  }

  onTypeChange() {
    this.hiddencol = false;
    const selectedType = this.assembly.get('type').value;
    if (selectedType == 'production') {
      this.hiddencol = true;
    }
  }
  onPlantChange(e) {
    this.assembly.get('departmentId').setValue('');
    // this.assembly.get('assemblyId').setValue('');
    this._machine.getDept(e).subscribe(
      data => {
        if (data != null) {
          this.deptOption = data;
        } else {
          this.snack.open('This Plant does not have Departments', 'ok', {
            duration: 5000
          });
        }
      }
    );
  }
}
