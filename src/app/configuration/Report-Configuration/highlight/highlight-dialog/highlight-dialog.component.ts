import * as moment from "moment";
import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder,  Validators,  } from '@angular/forms';
import { ConfigurationService } from "../../../configuration.service";
import { SelectionModel } from '@angular/cdk/collections';
import { MODE } from '../../../shared/config';
import { MatTableDataSource } from "@angular/material/table";
export interface HeaderElement {
  param_id: string,
  heading: string,
  param_type: string,
  sequence_no: number;
  calculation: string;
}

const HEADER_DATA: HeaderElement[] = [];

@Component({
  selector: 'app-highlight-dialog',
  templateUrl: './highlight-dialog.component.html',
  styleUrls: ['./highlight-dialog.component.scss']
})
export class HighlightDialogComponent {

  title: string;
  loadingForm: boolean;

  showHighlight: boolean;
  showParameter: boolean;
  parameterUpdate: boolean;
  validHeader: boolean;
  showParameterView: boolean;
  dataSourceForHeaders = new MatTableDataSource<any>();
  parameters;
  showHighlightDelete: boolean;
  ParameterShowData;
  tempData = [];
  sequenceNumbers = [1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  index;
  setParam: any[];

  usedParameters;
  indexofRow: number;
  showCalculation: boolean = false;
  calculationList: any[];

  highlight: FormGroup;
  parameter: FormGroup;
  loading: boolean;
  ParameterOption: any[];

  data = Object.assign(HEADER_DATA);
  displayedColumns: string[] = ['select', 'heading', 'unit', 'param_type', 'calculation', 'sequence_no'];
  dataSource = new MatTableDataSource<HeaderElement>(this.data);
  disable: boolean;
  selection = new SelectionModel<HeaderElement>(true, []);
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

  constructor(private _dialogRef: MatDialogRef<HighlightDialogComponent>,
    private _fb: FormBuilder,
    private _highlight: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.highlight = this._fb.group({
      highlight_id: '',
      report_id: [''],
      highlight_name: ['', Validators.required]
    });

    this.parameter = this._fb.group({
      param_id: '',
      highlight_param_id: '',
      highlight_id: '',
      unit: [''], //can be empty
      heading: ['', Validators.compose([Validators.required])],
      param_type: ['', Validators.required],
      sequence_no: ['', Validators.required],
      calculation: ['', Validators.required]
    });
    this.setValueToFormControl(dialog.mode, dialog.model);
  }


 
  setValueToFormControl(mode, model) {
    this.showHighlight = false;
    this.showParameter = false;
    this.validHeader = false;
    this.showParameterView = false;
    while (HEADER_DATA.length > 0) {
      HEADER_DATA.pop();
    }

    if ((mode === 'add') && (model === 'highlight')) {
      this._highlight.getReportParameterDetails('none').subscribe(data => {
        this.parameters = data;
      }, err => this.handleError(err));
      this.title = this.dialog.title + ' highlight';
      this.showHighlight = true;
      this.highlight.controls["report_id"].setValue(Number(this.dialog.details.report_id));
    }

    if ((mode === 'edit') && (model === 'highlight')) {
      this.title = this.dialog.title + ' highlight';
      this.showHighlight = true;
      this.highlight.controls['highlight_id'].setValue(Number(this.dialog.details.highlight_id));
      this.highlight.controls["report_id"].setValue(Number(this.dialog.details.report_id));
      this.highlight.controls["highlight_name"].setValue(this.dialog.details.highlight_name);
    }

    // ****************************Parameter Add, Update ******************************

    if ((mode === 'add') && (model === 'parameter')) {
      this.title = this.dialog.title + ' parameter';
      this.showParameter = true;
      this.getParam();
    }



    if ((mode === 'edit') && (model === 'parameter')) {
      this.title = 'Update Parameter';
      this.showParameterView = true;
      this.parameter.controls['param_id'].setValue(this.dialog.details.param_id);
      this.parameter.controls['highlight_id'].setValue(this.dialog.details.highlight_id);
      this.parameter.controls['highlight_param_id'].setValue(this.dialog.details.highlight_param_id)
      this.parameter.controls['heading'].setValue(this.dialog.details.heading);
      this.parameter.controls['sequence_no'].setValue(this.dialog.details.sequence_no);
      this.parameter.controls['calculation'].setValue(this.dialog.details.calculation);
      this.parameter.controls['unit'].setValue(this.dialog.details.unit);
      this._highlight.getReportParameterDetails('none').subscribe(data => {
        this.setParamList(data, this.dialog.details.parameter, this.dialog.reportId.parameters);
      });

      this._highlight.getCalculationList(this.dialog.details.parameter).subscribe(data => {
        this.calculationList = data;
        this.parameter.controls['calculation'].setValue(this.dialog.details.calculation);
      });

      this.getParameterByHighlightId(this.dialog.details.highlight_id);
    }

    if ((mode === 'delete')) {
      if (this.dialog.model === 'highlight') {
        this.title = this.dialog.details.highlight_name;
      }
      else {
        this.title = this.dialog.details.heading;
      }
      this.showHighlightDelete = true;
    }

  }

  setParamList(data, selectedParam, compareList) {
    let compare = [];
    for (let key of compareList) {
      if ((key.parameter.param_type === selectedParam.param_type) && (key.parameter.param_name === selectedParam.param_name)) { }
      else { compare.push(key.parameter); }
    }
    for (let key of compare) {
      let i = 0;
      for (let search of data) {
        if ((key.param_type === search.param_type) && (key.param_name === search.param_name)) {
          data.splice(i, 1);
        }
        i++;
      }
    }
    this.parameters = data;
    this.setParam = selectedParam;
    this.compareParam(this.parameters, this.setParam);
  }

  getParam() {
    this._highlight.getReportParameterDetails('none').subscribe(data => {
      for (let key of this.dialog.details.parameters) {

        let index = this.sequenceNumbers.findIndex((p) => { return p === key.sequence_no });
        this.sequenceNumbers.splice(index, 1);

        let i = 0;
        for (let search of data) {
          if ((key.parameter.param_type === search.param_type) && (key.parameter.param_name === search.param_name)) {
            data.splice(i, 1);
          }
          i++;
        }
      }
      this.parameters = data;
    });
  }


  onSubmit(value) {
    this.update(value, this.dialog.mode, this.dialog.model, 0, 0);
  }

  update(requestBody, mode: string, model: string, report_id, table_id) {
    this.highlight.disable();
    this.parameter.disable();
    this.loadingForm = true;
    switch (mode) {
      case MODE.ADD:
        this._highlight.AddHighLight(requestBody, model, report_id, table_id).subscribe(
          res => this._dialogRef.close(res),
          err => this.handleError(err)
        ); 

        break;

      case MODE.UPDATE:
        this._highlight.EditHighLight(requestBody, model, report_id, table_id).subscribe(
          res => this._dialogRef.close(res),
          err => this.handleError(err)
        );
        break;

      case MODE.DELETE:
        this._highlight.DeleteHighLight(report_id, table_id, '', model).subscribe(
          res => this._dialogRef.close(res),
          err => this.handleError(err)
        );
        break;
      default:
        return;
    }
  }


  delete() {
    this.loading = true;
    this.update(this.dialog.details, this.dialog.mode, this.dialog.model, this.dialog.reportId, this.dialog.tableId);
  }

  onParamChange(event) {
    this.setCalculationList(event);
    this.index = this.parameters.findIndex(function (o) {
      return o.param_name === event.param_name;
    });

  }

  setCalculationList(event) {
    this.parameter.controls['calculation'].enable();
    this.parameter.controls['param_id'].setValue(event.id);
    this.parameter.controls['highlight_id'].setValue(this.dialog.details.highlight_id);
    this.calculationList = null;
    this._highlight.getCalculationList(event).subscribe(data => {
      if (data != null) {
        this.calculationList = data;
      } else {
        this.parameter.controls['calculation'].disable();
      }
    }, err => this.handleError(err)); // get calculation list    

  }



  addParameter() {
    let compare = [];
    for (let key of HEADER_DATA) {
      compare.push(key.heading);
    }
    for (let key of this.dialog.details.parameters) {
      compare.push(key.heading);
    }
    let flag = 0;
    for (let comp of compare) {
      if (comp === this.parameter.controls['heading'].value) {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.parameter.controls['heading'].setErrors({ 'incorrect': true });
    }  //heading name validation

    if (this.parameter.valid) {
      let ob = Object(this.parameter.value);
      ob.param_id = ob.param_type.id;  //set Param_ID
      ob.param_type = ob.param_type //set ParamType
      this.sequenceNumber(ob);
    }
  }

  sequenceNumber(headers) {
    let tempData = { param_id: '', heading: '', param_type: '', sequence_no: 1, calculation: '' };
    Object.assign(tempData, this.parameter.value);
    HEADER_DATA.push(tempData);
    this.validHeader=true;
    HEADER_DATA.sort(function (a, b) {
      return a.sequence_no - b.sequence_no
    }) //Sorting data;
    this.dataSource = new MatTableDataSource(HEADER_DATA);
    this.parameter.controls['heading'].setValue('');     //privateing when add headers into dataSource
    this.parameter.controls['sequence_no'].setValue(''); //privateing when add headers into dataSource
    this.parameter.controls['param_type'].setValue('');
    this.parameter.controls['calculation'].setValue('');
    this.parameter.controls['unit'].setValue('');

    let index = this.sequenceNumbers.findIndex((p) => { return p === tempData.sequence_no });
    this.sequenceNumbers.splice(index, 1);

    this._highlight.getReportParameterDetails('none').subscribe(data => {
      let compareParamList = [];
      for (let list1 of this.dialog.details.parameters) {
        compareParamList.push(list1.parameter);
      }
      for (let list2 of HEADER_DATA) {
        compareParamList.push(list2.param_type);
      }
      for (let key of compareParamList) {
        let i = 0;
        for (let search of data) {

          if ((key.param_type === search.param_type) && (key.param_name === search.param_name) && (key.id === search.id)) {
            data.splice(i, 1);
          }
          i++;
        }
      }
      this.parameters = data;
    });
  }

  removeParameter() {
    let Array = [];
    this.selection.selected.forEach(item => {
      Array.push(item.param_type);
      let index: number = this.data.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1); //restored parameters list
      HEADER_DATA.splice(index,1);
      this.sequenceNumbers.push(item.sequence_no);
      this.sequenceNumbers.sort(function (a, b) {
        return a - b
      }) //Sorting data;
      this.dataSource = new MatTableDataSource<HeaderElement>(this.dataSource.data);
    });
    for (let ArrayList of Array) {
      this.parameters.push(ArrayList);
    }
    this.selection = new SelectionModel<HeaderElement>(true, []);
    if (this.dataSource.data.length == 0) {
      this.validHeader = false;
    }
    else {
      this.validHeader = true;
    }
  }

  getParameterByHighlightId(highlight_id) {
    this._highlight.getParameterByHighlightId(highlight_id).subscribe(data => {
      this.dataSourceForHeaders = new MatTableDataSource(data);
    }, err => this.handleError(err));
  }


  compareParam(parameter1: any, parameter2: any) {
    return parameter1 && parameter2 ? parameter1.id === parameter2.id : parameter1 === parameter2;
  }


  ParameterOpearation(event) {
    let Name = [];
    for (let key of this.dialog.reportId.parameters) {
      if (this.dialog.details.heading !== key.heading) {
        Name.push(key.heading);
      }
    }

    for (let name of Name) {
      if (name === event.heading) {
        this.parameter.controls['heading'].setErrors({ 'incorrect': true });
        break;
      }
    }  // set validation label name must be unique

    if (this.parameter.valid) {
      this._highlight.EditHighLight(event, 'parameter', this.dialog.highlight_param_id, this.dialog.tableId).subscribe(res => {
        this._dialogRef.close(res);
      }, err => this.handleError(err));
    }
  }

  private handleError(err) {
    this._highlight.throwError(err);
    this.highlight.enable();
    this.parameter.enable();
    this.loadingForm = false;
    this.loading = false;
  }
}