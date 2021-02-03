import {
  Component,
  OnInit,
  Inject, 
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfigurationService } from "../../../configuration.service";
import { MODE } from "../../../shared/config";
import { cloneDeep } from "lodash";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-machine-dialog',
  templateUrl: './machine-dialog.component.html',
  styleUrls: ['./machine-dialog.component.scss']
})
export class MachineDialogComponent implements OnInit {
  selectedAssociatedMC;
  selectedType;
  disabledAlarm;
  type = 'machine';
  machineTypes;
  machine: FormGroup;
  plantOption = [];
  deptOption = [];
  assembly = [];
  machines = [];
  list = [];
  groups: any;
  loading: boolean;
  check: boolean;
  hiddencol: boolean = false; //CBM Parameters
  hide: boolean = false; //for assosiative MachineName
  invalid: boolean = false //for Groups



  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private dialogRef: MatDialogRef<MachineDialogComponent>,
    private fb: FormBuilder,
    private _machine: ConfigurationService,
    private snack: MatSnackBar
  ) {
    this.machine = this.fb.group({
      machineId: "",
      name: ["", Validators.required],
      assosiativeName: ["", Validators.required],
      assemblyId: ["", Validators.required],
      plantId: ["", Validators.required],
      departmentId: ["", Validators.required],
      ppm: ["", [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"), Validators.min(0)]],
      maintenance: ["", [Validators.min(0)]],
      sequenceNumber: ["", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      type: ["", Validators.required],
      pgIds: ["", Validators.required],
      cbmParameter: "",
      alarm: [false] 
    });

    this.machine.disable();
    this.loading = true;
    // set deafult value
    this.machine.controls['ppm'].setValue(1);

    if (dialog.mode === MODE.DELETE) {
      this.loading = false;
      this.machine.enable();
    }

    if (dialog.mode === MODE.UPDATE) {
      if (this.dialog.details.alarm === true) {
        this.disabledAlarm = true;
      } else {
        this.disabledAlarm = false;
      }
      this.selectedAssociatedMC = this.dialog.details.assosiativeName;
      this.selectedType = this.dialog.details.machineType;
      this.machine.get('type').clearValidators();
      this.machine.get('assosiativeName').clearValidators();
      this.machine.controls["name"].setValue(this.dialog.details.machineName);
      this.machine.controls["sequenceNumber"].setValue(Number(this.dialog.details.sequenceNumber));
      this.machine.controls["machineId"].setValue(Number(this.dialog.details.machineId));
      this.machine.controls["pgIds"].setValue(this.dialog.details.pgIds);
      this.machine.controls["cbmParameter"].setValue(this.dialog.details.cbmParameter);
      this.machine.controls["alarm"].setValue(this.dialog.details.alarm);


      this._machine.getPlants(0, 0).subscribe(data => {
        this.plantOption = data;
        this.machine.controls["plantId"].setValue(Number(this.dialog.details.plantId));
      }, err => this.handleError(err));

      this._machine.getDept(this.dialog.details.plantId).subscribe(data => {
        this.deptOption = data;
        this.machine.controls["departmentId"].setValue(Number(this.dialog.details.departmentId));
      }, err => this.handleError(err));

      this._machine.getAssemblys(this.dialog.details.departmentId).subscribe(data => {
        this.assembly = data;
        this.machine.controls["assemblyId"].setValue(Number(this.dialog.details.assemblyId));
      }, err => this.handleError(err));



      this.hide = true;
      this.invalid = true;
      this.machine.enable();
      this.loading = false;
      if (this.dialog.details.machineType === 'production') {
        this.hiddencol = true;
        this.machine.controls["ppm"].setValue(Number(this.dialog.details.cbmParameter[0].value));
        this.machine.controls["maintenance"].setValue(Number(this.dialog.details.cbmParameter[1].value));
      }
    }

    if (dialog.mode === MODE.ADD) {
      this._machine.getPlants(0, 0).subscribe(data => {
        if (data != null)
          this.plantOption = data;
        else
          this.snack.open('No Plants', 'ok', { duration: 5000 });
      }, err => this.handleError(err));

      this._machine.getParameterGroup().subscribe(data => {
        if (data != null)
          this.groups = data;
        else
          this.snack.open('No Parameter Group', 'ok', { duration: 5000 });
      }, err => this.handleError(err));

      this._machine.getAssocitiveMachine(this.type).subscribe(data => {
        if (data != null)
          this.machines = data;
        else
          this.snack.open('No Associtive Name', 'ok', { duration: 5000 });
      }, err => this.handleError(err));
      this.machine.enable();
      this.loading = false;
    }


  }

  ngOnInit() {
    this._machine.getMachineType().subscribe(data => {
      this.machineTypes = data;
    });
  }

  onChange(event) {
    if (this.dialog.details.alarm) {
      this.machine.controls["alarm"].setValue(true);
    } else {
      this.machine.controls["alarm"].setValue(event.checked);
    }
  }
  onPlantChange(e) {
    this.machine.get('departmentId').setValue('');
    this.machine.get('assemblyId').setValue('');
    this._machine.getDept(e).subscribe(
      data => {
        if (data != null)
          this.deptOption = data;
        else
          this.snack.open('This Plant does not have Departments', 'ok', {
            duration: 5000
          });
      }
    )
  }

  onDepartmentChange(e) {
    this.machine.get('assemblyId').setValue('');
    this._machine.getAssemblys(e).subscribe(
      data => {
        if (data != null)
          this.assembly = data;
        else
          this.snack.open('This Departments does not have Assemblye ', 'ok', {
            duration: 5000
          });
      }
    )
  }

  onCheckboxChange(id, event) {
    if (event.target.checked) {
      this.list.push({ id: id, checked: event.target.checked });
    } else {
      for (var i = 0; i <= this.list.length; i++) {
        if (this.list[i].id == id) {
          this.list.splice(i, 1);
        }
      }
    }
    //check list  is empty or not(validation for checkboxes)
    if (Array.isArray(this.list) && this.list.length) {
      this.check = false;
    } else {
      this.machine.controls['pgIds'].setErrors({ 'incorrect': true });
      this.check = true;
    }
  }

  onTypeChange() {
    this.hiddencol = false;
    let selectedType = this.machine.get('type').value;
    if (selectedType == 'production') {
      this.hiddencol = true;
    }

  }

  onSubmit() {
    if (this.machine.get('pgIds').value) {
      this.update(this.machine.value, this.dialog.mode)
    }
  }

  update(parameter, mode) {

    let tempData = Object.assign({}, parameter);

    let list;
    if (this.dialog.mode === MODE.UPDATE) {
      list = this.dialog.details.pgIds.map(a => a);
    } else {
      list = this.list.map(a => a.id);  //Format PGID as [1,3,2] group ids
    }

    tempData.pgIds = cloneDeep(list);
    tempData['dataAvailable'] = true;
    this.machine.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
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
        this._machine.addMachines(tempData).subscribe(data => {
          this.dialogRef.close(data);
        }, err => this.handleError(err));
        break;

      case MODE.UPDATE:
        if (tempData['cbmParameter'].length > 0) {
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
        tempData['assosiativeName'] = this.selectedAssociatedMC;
        tempData['type'] = this.selectedType;
        this._machine.updateMachines(tempData).subscribe(data => {
          this.dialogRef.close(data);
        }, err => this.handleError(err));

        break;

      case MODE.DELETE:
        this._machine.deleteMachine(tempData.machineId, this.type).subscribe(
          res => this.dialogRef.close(parameter),
          err => this.handleError(err));
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
