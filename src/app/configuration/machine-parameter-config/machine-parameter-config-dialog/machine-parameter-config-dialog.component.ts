import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';

@Component({
  selector: 'app-machine-parameter-config-dialog',
  templateUrl: './machine-parameter-config-dialog.component.html',
  styleUrls: ['./machine-parameter-config-dialog.component.scss']
})
export class MachineParameterConfigDialogComponent implements OnInit {
  parameter: FormGroup;
  loading: boolean;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private dialogRef: MatDialogRef<MachineParameterConfigDialogComponent>,
    private fb: FormBuilder,
  ) {

    this.parameter = this.fb.group({
      criticality: ["", Validators.required],
      min_count: ['', Validators.required],
      max_count: ['', Validators.required],
      reset_count: ['', Validators.required],
      unit: ['', Validators.required],//, Validators.pattern("[a-zA-Z][a-zA-Z ]+")
      paramType: ['', Validators.required],
    });
  }

  paramType() {
    return this.parameter.get("paramType").value;
  }

  ngOnInit() {
    if (this.dialog.mode === MODE.UPDATE) {
      this.parameter.controls['criticality'].setValue(this.dialog.details.criticality);
      this.parameter.controls['min_count'].setValue(this.dialog.details.min_count);
      this.parameter.controls['max_count'].setValue(this.dialog.details.max_count);
      this.parameter.controls['reset_count'].setValue(this.dialog.details.reset_count);
      this.parameter.controls['unit'].setValue(this.dialog.details.unit);

      if (this.dialog.details.realParameter === false && this.dialog.details.countedParameter === false) {
        this.parameter.controls['paramType'].setValue('rawParameter');
      } else {
        if (this.dialog.details.realParameter === true) {
          this.parameter.controls['paramType'].setValue('realParameter');
        } else if (this.dialog.details.countedParameter === true) {
          this.parameter.controls['paramType'].setValue('countedParameter');
        }
      }

    }

  }

  onSubmit() {

    let result = Object.assign({}, this.parameter.value);
    delete result['paramType'];

    if (this.paramType() == "rawParameter") {
      result.countedParameter = false;
      result.realParameter = false;
    } else if (this.paramType() == "countedParameter") {
      result.countedParameter = true;
      result.realParameter = false;
    }
    else {
      result.realParameter = true;
      result.countedParameter = false;
    }

    result.param_name = this.dialog.details.param_name;
    result.param_type = this.dialog.details.param_type;
    result.param_datatype = this.dialog.details.param_datatype;
    result.column_name = this.dialog.details.column_name;
    result.default_value = this.dialog.details.default_value;
    result.calculation = this.dialog.details.calculation;
    result.id = this.dialog.details.id;

    if (this.parameter.valid) {
      this.configurationService
        .updateMachineParameter(result)
        .subscribe(
          resp => this.dialogRef.close(resp),
          err => this.handleError(err)
        );
    }
  }

  private handleError(err) {
    this.configurationService.throwError(err);
    this.parameter.enable();
    this.loading = false;
  }
}


