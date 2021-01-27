import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfigurationService } from '../../../configuration.service';
import { MODE } from '../../../shared/config';
export interface HeaderElement {
  param_id: string,
  heading: string,
  param_type: string,
  sequence_no: number;
  calculation: string;
  unit: string;
}

const HEADER_DATA: HeaderElement[] = [];

@Component({
  selector: 'app-report-table-dialog',
  templateUrl: './report-table-dialog.component.html',
  styleUrls: ['./report-table-dialog.component.scss']
})
export class ReportTableDialogComponent {
  table: FormGroup;
  header: FormGroup;
  loading: boolean;
  showTable: boolean = false;
  showHeader: boolean = false;
  showDelete: boolean = false;
  showCalculation: boolean = false;
  showUpdateHeader: boolean = false;
  tableType;
  tableValidation: string
  parameters;
  sequenceNumbers: number[] = [];
  calculationList;
  index;
  validHeader: boolean;
  displayedColumns: string[] = ['select', 'heading', 'unit', 'param_type', 'sequence_no'];
  data = Object.assign(HEADER_DATA);
  dataSource = new MatTableDataSource<HeaderElement>(this.data);
  selection = new SelectionModel<HeaderElement>(true, []);
  title: string;
  setParam;
  tempData = [];
  unitColunmForHeaders= [];
  dataColunmForHeaders = [];
  previewHeaders: boolean = false;
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
    private _dialogRef: MatDialogRef<ReportTableDialogComponent>,
    private _fb: FormBuilder,
    private config: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {
    this.table = this._fb.group({
      table_id: '',
      report: [''],
      table_name: ['', Validators.required],
      table_type: ['', Validators.required]
    });
    this.header = this._fb.group({
      header_id: '',
      param_id: '',
      unit: '',
      heading: ['', Validators.compose([Validators.required])],
      param_type: ['', Validators.required],
      sequence_no: ['', Validators.required],
      calculation: ''
    });
    this.getTemplate(dialog.mode, dialog.model);
  }

  getTemplate(mode, model) {
    this.sequenceNumbers = [];
    while (HEADER_DATA.length > 0) {
      HEADER_DATA.pop();
    }

    if ((mode === 'add') && (model === 'table')) {
      this.reportChange(this.dialog.details);
      this.dialog.title = "Add Table";
      this.showTable = true;
      this.table.controls['report'].setValue(this.dialog.details);
    }
    if ((mode === 'edit') && (model === 'table')) {
      this.dialog.title = "Update Table";
      this.showTable = true;
      this.tableType = ["monitoring", "summary"];  //add if add new value in DB
      this.table.controls['table_id'].setValue(Number(this.dialog.details.table_id));
      this.table.controls['report'].setValue(this.dialog.details.report);
      this.table.controls['table_name'].setValue(this.dialog.details.table_name);
      this.table.controls['table_type'].disable();
      this.table.controls['table_type'].setValue(this.dialog.details.table_type);
    }

    if ((mode === 'add') && (model === 'header')) {
      if (this.dialog.details.table_type === "summary") {
        this.displayedColumns = ['select', 'heading', 'unit', 'param_type', 'sequence_no', 'calculation'];
        this.showCalculation = true;
      }

      this.dialog.title = "Add Header";
      this.showHeader = true;
      this.sequenceNumbers = [1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
      this.config.getReportParameterDetails('none').subscribe(data => {
        this.parameters = data;
        this.getParam(data, this.dialog.details.headers);
      }, err => this.handleError(err));
    }

    if ((mode === 'edit') && (model === 'header')) {
      if (this.dialog.details.table_type === "summary") {
        this.showCalculation = true;
      }
      this.header.controls["header_id"].setValue(Number(this.dialog.header.header_id));
      this.header.controls["heading"].setValue(this.dialog.header.heading);
      this.header.controls["unit"].setValue(this.dialog.header.unit);
      this.header.controls["param_id"].setValue(Number(this.dialog.header.param_id));
      this.header.controls['sequence_no'].setValue(Number(this.dialog.header.sequence_no));
      // set calcultion control value if type is summary and show control 
      if (this.dialog.details.table_type === "summary") {
        this.dialog.header.parameter.calculation = this.dialog.header.calculation;
        this.config.getCalculationList(this.dialog.header.parameter).subscribe(data => {
          this.calculationList = data;
        }, err => this.handleError(err));
        this.header.controls['calculation'].setValue(this.dialog.header.calculation);
      }
      //set Parameters control
      this.config.getReportParameterDetails('none').subscribe(data => {
        if (this.dialog.details.table_type === "summary") {
          this.parameters = data;
          this.setParam = this.dialog.header.parameter;
          this.compareParam(this.parameters, this.dialog.header.parameter);
        } //For Summary show all param
        else {
          let temp = [];
          for (let ob of this.dialog.details.headers) {
            if (this.dialog.header.parameter.param_name !== ob.parameter.param_name) {
              temp.push(ob.parameter);
            }
          }
          for (let ob of temp) {
            let index = data.findIndex((p) => { return p.param_name === ob.param_name });
            data.splice(index, 1);
          }
          this.parameters = data;
          this.setParam = this.dialog.header.parameter;
          this.compareParam(this.parameters, this.dialog.header.parameter);
        }
      }, err => this.handleError(err));
      this.showUpdateHeader = true;
    }

    if (mode === 'view') {
      this.dialog.title='';
      this.previewHeaders = true;
      this.unitColunmForHeaders = [];
      this.dataColunmForHeaders = [];
      this.getHeadersByReportID(this.dialog.details.report.report_id, this.dialog.details.table_type);
    }
    if (mode === 'delete') {
      if (this.dialog.model === 'table') { this.title = this.dialog.details.table_name; }
      else { this.title = this.dialog.header.heading; }
      this.showDelete = true;
    }

  }

  compareParam(compareArray, match) {
    return compareArray && match ? compareArray.param_name === match.param_name : compareArray === match;
  }

  getParam(parameters, data) {
    let index1;
    if (this.dialog.details.table_type === "summary") { } //show all param to summary table
    else {
      for (let param of data) {
        index1 = parameters.findIndex((p) => { return p.param_name === param.parameter.param_name });
        this.parameters.splice(index1, 1);
      }
    }
    let index2;
    for (let param of data) {
      index2 = this.sequenceNumbers.findIndex((p) => { return p === param.sequence_no });
      this.sequenceNumbers.splice(index2, 1);
    }
    this.sequenceNumbers.sort(function (a, b) {
      return a - b
    })
  }

  getHeadersByReportID(reportId, tableType) {
    this.config.getHeadersByReportID(reportId, tableType).subscribe(data => {
      for (let key of data) {
        this.dataColunmForHeaders.push(key.heading);
        this.unitColunmForHeaders.push(key);
      }
      var ob = {};
      for (let key of this.dataColunmForHeaders) {
        let pro = key; ob[pro] = "-";
      }
      for (let i = 1; i <= 2; i++) {
        this.tempData.push(ob)
      }
    }, err => this.handleError(err));
  }

  reportChange(value) {
    this.table.controls['table_type'].setValue('');
    this.tableValidation = "";
    this.tableType = null;
    this.config.getTableType(value.report_id).subscribe(data => {
      if (data != null) {
        this.tableType = data;
        this.table.controls['table_type'].enable();
      }
      else {
        this.tableValidation = "unable to create table for this report";
      }

    }, err => this.handleError(err));
  }

  onParamChange(event) {
    this.setCalculationList(event);
    this.index = this.parameters.findIndex(function (o) {
      return o.param_name === event.param_name;
    });
  }

  setCalculationList(event) {
    this.header.controls['calculation'].enable();
    this.header.controls['param_id'].setValue(event.id);
    this.calculationList = null;
    if (this.dialog.details.table_type === "summary") {
      this.config.getCalculationList(event).subscribe(data => { 
        if (data != null) {
          this.calculationList = data;
        } else {
          this.header.controls['calculation'].disable();
        }
      }, err => this.handleError(err)); // get calculation list    
    }
  }

  addHeader() {
    // let flag = 0;
    // if (this.usedHeaders != undefined) {
    //   for (let i of this.usedHeaders) {
    //     if (i.heading === this.header.controls['heading'].value) {
    //       flag = 1;
    //       break;
    //     }
    //   }
    // }
    // if (flag == 1) { this.header.controls['heading'].setErrors({ 'incorrect': true }); }
    // else {
    //   let flag = 0;
    //   this.validHeader = true;
    //   let ob = Object(this.header.value);
    //   for (let i of HEADER_DATA) { if (i.heading === ob.heading) { flag = 1; break; } }
    //   if (flag == 1) { this.header.controls['heading'].setErrors({ 'incorrect': true }); }
    //   else {
    //     ob.param_id = ob.param_type.id;  //set Param_ID
    //     ob.param_type = ob.param_type //set ParamType
    //     this.sequenceNumber(ob);
    //   }
    // }

    let compare = [];
    for (let key of HEADER_DATA) {
      compare.push(key.heading);
    }
    for (let key of this.dialog.details.headers) {
      compare.push(key.heading);
    }
    let flag = 0;
    for (let comp of compare) {
      if (comp === this.header.controls['heading'].value) {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.header.controls['heading'].setErrors({ 'incorrect': true });
    }  //heading name validation

    if (this.header.valid) {
      let ob = Object(this.header.value);
      ob.param_id = ob.param_type.id;  //set Param_ID
      ob.param_type = ob.param_type //set ParamType
      this.sequenceNumber(ob);
    }
    
  }

  sequenceNumber(headers) {
    let tempData = { param_id: '', heading: '', param_type: '', sequence_no: 1, calculation: '', unit: '' };
    Object.assign(tempData, this.header.value);
    HEADER_DATA.push(tempData);
    this.validHeader = true;
    HEADER_DATA.sort(function (a, b) {
      return a.sequence_no - b.sequence_no
    }) //Sorting data;

    if (this.dialog.details.table_type === "summary") { }
    else { if (this.index !== -1) this.parameters.splice(this.index, 1); }  //remove paramters from list


    HEADER_DATA.sort(function (a, b) {
      return a.sequence_no - a.sequence_no
    }) //Sorting data;

    this.dataSource = new MatTableDataSource(HEADER_DATA);
    this.header.controls['heading'].setValue('');     //privateing when add headers into dataSource
    let index = this.sequenceNumbers.findIndex((p) => { return p === tempData.sequence_no });
    this.sequenceNumbers.splice(index, 1);
    this.header.controls['sequence_no'].setValue(''); //privateing when add headers into dataSource
    this.header.controls['param_type'].setValue('');
    this.header.controls['calculation'].setValue('');
    this.header.controls['unit'].setValue('');
  }

  removeHeader() {
    this.selection.selected.forEach(item => {
      let index: number = this.data.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
      HEADER_DATA.splice(index,1);
      if (this.dialog.details.table_type === "summary") { } else { this.parameters.push(item.param_type); }  //restored parameters list
      this.sequenceNumbers.push(item.sequence_no);
      this.sequenceNumbers.sort(function (a, b) {
        return a - b
      }) //Sorting data;
      this.dataSource = new MatTableDataSource<HeaderElement>(this.dataSource.data);
    });
    this.selection = new SelectionModel<HeaderElement>(true, []);
    if (this.dataSource.data.length == 0) {
      this.validHeader = false;
    }
    else {
      this.validHeader = true;
    }
  }

  headersOpearation(event) {
    let flag = 0;
    for (let i = 0; i < this.dialog.details.headers.length; i++) {
      if (i == this.dialog.index) { continue; }
      else { if (this.dialog.details.headers[i].heading === event.heading) { flag = 1; break; } }
    }
    if (flag == 1) { this.header.controls['heading'].setErrors({ 'incorrect': true }); }
    else {
      this.onSubmit(event);
    }
  }

  onSubmit(value) {
    if ((this.dialog.mode === 'edit') && (this.dialog.model === 'table')) {
      value.table_type = this.dialog.details.table_type;
      value.report = this.dialog.details.report;
    }
    this.update(value, this.dialog.mode, this.dialog.model, this.dialog.details);
  }

  update(req, mode, model, details) {
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this.config
          .addTableHeader(req, model, details)
          .subscribe(
          res => this._dialogRef.close(res),
          err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this.config
          .updateTableHeader(req, model, details)
          .subscribe(
          res => this._dialogRef.close(req),
          err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this.config
          .deleteTableHeader(req, model, details)
          .subscribe(
          res => this._dialogRef.close(res),
          err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this.config.throwError(err);
    this.table.enable();
    this.loading = false;
  }
}

