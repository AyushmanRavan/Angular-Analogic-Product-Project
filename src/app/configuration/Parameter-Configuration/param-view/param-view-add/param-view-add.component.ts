import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validator, Validators } from "@angular/forms";

import { MODE } from "./../../../shared/config";
import { ConfigurationService } from "./../../../configuration.service";

@Component({
  selector: "app-param-view-add",
  templateUrl: "./param-view-add.component.html",
  styleUrls: ["./param-view-add.component.scss"]
})
export class ParamViewAddComponent implements OnInit {
  para;
  parameter: FormGroup;
  loading: boolean;
  disabled: boolean;
  enabled: boolean;
  dataTypes;
  hiddencol: boolean = false;
  reservedTypes: string[] = ["int", "float", "datetime", "bit"];
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private _dialogRef: MatDialogRef<ParamViewAddComponent>,
    private fb: FormBuilder,
    private _param: ConfigurationService
  ) {
    this.parameter = this.fb.group({
      id: "",
      paramName: ["", Validators.required],
      paramDataType: ["", Validators.required],
      length: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      defaultValue: ["", Validators.required],
      criticality: ["", Validators.required],
      countedParam: [''],
      realParam: [''], 
    //  rawParam: [''],
      paramTypes: [''],
      maxValue: ['', Validators.required],
      minValue: ['', Validators.required],
      resetCount: ['', Validators.required]
      // options: ['1']

    });

    // if (dialog.mode === MODE.UPDATE) {
    //   this.hiddencol = this.reservedTypes.includes(dialog.details.paramDataType);
    //   this.hiddencol && this.parameter.controls["length"].clearValidators();
    //   this.parameter.controls['id'].setValue(Number(dialog.details.id));
    //   this.parameter.controls['paramName'].setValue(dialog.details.paramName);
    //   this.parameter.controls['paramDataType'].setValue(dialog.details.paramDataType);
    //   this.parameter.controls['length'].setValue(Number(dialog.details.length));
    //   this.parameter.controls['defaultValue'].setValue(dialog.details.defaultValue);
    //   this.parameter.controls['criticality'].setValue(dialog.details.criticality);
    //   this.parameter.controls['realParam'].setValue(dialog.details.realParam);
    //   this.parameter.controls['countedParam'].setValue(dialog.details.countedParam);
    //   this.parameter.controls['minValue'].setValue(dialog.details.minValue);
    //   this.parameter.controls['maxValue'].setValue(dialog.details.maxValue);
    //   this.parameter.controls['resetCount'].setValue(dialog.details.resetCount);

    //   if (dialog.details.realParam !== true && dialog.details.countedParam !== true) {
    //     this.parameter.controls['paramTypes'].setValue('rawParamIsSelected');
    //   }else {
    //     if (dialog.details.realParam === true) {
    //       this.parameter.controls['paramTypes'].setValue('realParamIsSelected');
    //     }else if (dialog.details.countedParam === true) {
    //       this.parameter.controls['paramTypes'].setValue('countParamIsSelected');
    //     }
    //   }
    // }
  }

  ngOnInit() {
    if (this.dialog.mode === MODE.UPDATE) {
      this.hiddencol = this.reservedTypes.includes(this.dialog.details.paramDataType);
      this.hiddencol && this.parameter.controls["length"].clearValidators();
      this.parameter.controls['id'].setValue(Number(this.dialog.details.id));
      this.parameter.controls['paramName'].setValue(this.dialog.details.paramName);
      this.parameter.controls['paramDataType'].setValue(this.dialog.details.paramDataType);
      this.parameter.controls['length'].setValue(Number(this.dialog.details.length));
      this.parameter.controls['defaultValue'].setValue(this.dialog.details.defaultValue);
      this.parameter.controls['criticality'].setValue(this.dialog.details.criticality);
      this.parameter.controls['realParam'].setValue(this.dialog.details.realParam);
      this.parameter.controls['countedParam'].setValue(this.dialog.details.countedParam);
      this.parameter.controls['minValue'].setValue(this.dialog.details.minValue);
      this.parameter.controls['maxValue'].setValue(this.dialog.details.maxValue);
      this.parameter.controls['resetCount'].setValue(this.dialog.details.resetCount);

      if (this.dialog.details.realParam !== true && this.dialog.details.countedParam !== true) {
        this.parameter.controls['paramTypes'].setValue('rawParamIsSelected');
      }else {
        if (this.dialog.details.realParam === true) {
          this.parameter.controls['paramTypes'].setValue('realParamIsSelected');
        }else if (this.dialog.details.countedParam === true) {
          this.parameter.controls['paramTypes'].setValue('countParamIsSelected');
        }
      }
    }
    if (this.dialog.mode !== MODE.DELETE) {
      this.parameter.disable();
      this.loading = true;
      this._param.getDatatypes().subscribe(data => {
        this.dataTypes = data;
        this.parameter.enable();
        if (this.dialog.mode === MODE.UPDATE)
          this.parameter.controls["paramDataType"].disable();
        this.loading = false;
      });
    }
  }
  
  removeValidators(selectedParam) {
    // alert('dfafa');
    for (const key in this.parameter.controls) {
      if (this.parameter.controls.hasOwnProperty(key)) {
        if (selectedParam === 'realParamIsSelected' || selectedParam === 'rawParamIsSelected') {
          if (key === 'maxValue' || key === 'minvalue') {
            this.parameter.get(key).setValidators(Validators.required);
            this.parameter.get(key).updateValueAndValidity();
          } else if (key === 'resetCount') {
            this.parameter.get(key).setValue(null);
            this.parameter.get(key).clearValidators();
            this.parameter.get(key).updateValueAndValidity();
          }
        } else if (selectedParam === 'countParamIsSelected') {
          if (key === 'maxValue' || key === 'minValue') {
            this.parameter.get(key).setValue(null);
            this.parameter.get(key).clearValidators();
            this.parameter.get(key).updateValueAndValidity();
          } else if (key === 'resetCount') {
            this.parameter.get(key).setValidators(Validators.required);
            this.parameter.get(key).updateValueAndValidity();
          }
        }
      }
    }
  }

  onSubmit() {
    if (this.parameter.valid) {
      this.update(this.parameter.value, this.dialog.mode);
    }
  }

  onChange(datatype: string) {
    this.hiddencol = this.reservedTypes.includes(datatype);
    this.hiddencol && this.parameter.get("length").setValue(0);
  }

  update(param, mode) {
    this.parameter.disable();
    switch (param.paramTypes) {
      case 'realParamIsSelected':
        param['realParam'] = true;
        param['countedParam'] = false;
        param['resetCount'] = 999;
       delete param['paramTypes'];
        break;
      case 'countParamIsSelected':
        param['countedParam'] = true;
        param['realParam'] = false;
        param['maxValue'] = -999;
        param['minValue'] = 999;
        delete param['paramTypes'];
        break;
      case 'rawParamIsSelected':
        param['realParam'] = false;
        param['countedParam'] = false;
        param['resetCount'] = 999;
        delete param['paramTypes'];
        break;
    }
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._param
          .addParameter(param)
          .subscribe(
            newAlarm => this._dialogRef.close(newAlarm),
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        {
          const { id, ...rest } = param;
          this._param
            .updateParameter(id, {
              ...rest,
              paramDataType: this.dialog.details.paramDataType
            })
            .subscribe(
              res => this._dialogRef.close(param),
              err => this.handleError(err)
            );
        }
        break;

      case MODE.DELETE:
        this._param
          .deleteParameter(param.id)
          .subscribe(
            res => this._dialogRef.close(param),
            err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this._param.throwError(err);
    this.parameter.enable();
    this.loading = false;
  }
}