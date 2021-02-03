import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfigurationService } from '../../../configuration.service';
import { MODE } from '../../../shared/config';

export interface Element {
  labelId: number,
  labelName: string,
  labelParameter: string,
  labelType: string,
  labelColor: string
}

export interface Properties {
  propertyName: string,
  propertyKey: string,
  valueType: string,
  chartType: string
}

export interface Element {
  key: string;
}

const DATA = [];
const DATAPROPERTY = [];
@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrls: ['./chart-dialog.component.scss']
})
export class ChartDialogComponent {
  exampleString: string;
  properties: Properties[];
  propertiesForm: FormGroup;
  propertiesKey: string = "";
  JsonProperties: any = {};
  errMsgForProperties: string = "";

  columnsToDisplay: string[] = ['select', 'propertyName', 'key', 'value'];
  dataProperty = Object.assign(DATAPROPERTY);
  propertiesData: MatTableDataSource<any> = new MatTableDataSource<any>(this.dataProperty);
  showTable: boolean = true;
  chartType: string;

  JSONExampleData: any;

  chart: FormGroup;
  label: FormGroup;

  loading: boolean;
  showUpdateOption: boolean = false;
  showChart: boolean = false;
  showLabel: boolean = false;
  showUpdateLabel: boolean = false;
  showDelete: boolean = false;
  showColorBox: boolean = false;
  showColorBoxModel: boolean = false;
  hideColorBox: boolean = true;
  selectedColor: string;
  showCalculation: boolean = false;
  showOption: boolean = false;

  validLabel: boolean;
  breakpoint: any;
  editParam: any;
  colorlabel: string;

  chartTypes = ['line', 'bar', 'pie', 'guage', 'doughnut'];
  chartDataTypes = ['summary', 'monitoring'];

  sequnceNumber = [1, 2, 3, 4, 5, 6];
  chartColor = [];
  paramList = [];
  calculationList = [];
  labelType = ['X-Axis', 'Y-Axis'];
  displayedColumns: string[] = ['select', 'labelName', 'labelParameter', 'labelType', 'labelColor'];

  data = Object.assign(DATA);
  title: string;
  dataSource = new MatTableDataSource<Element>(this.data);
  selection = new SelectionModel<Element>(true, []);

  apiResponseData: any;
  Options: string[] = [];
  Property: any[] = [];
  PropertyKeys: any;
  propertyName: string;
  invalidData: string;

  isAllSelected(model) {
    const numSelected = this.selection.selected.length;
    if (model === 'property') {
      const numRows = this.propertiesData.data.length;
      return numSelected === numRows;
    } else {
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }
  masterToggle(model) {
    if (model === 'property') {
      this.isAllSelected('property') ?
        this.selection.clear() :
        this.propertiesData.data.forEach(row => this.selection.select(row));
    } else {
      this.isAllSelected('') ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  showTypeOfLable: boolean = true;

  constructor(
    private _dialogRef: MatDialogRef<ChartDialogComponent>,
    private _fb: FormBuilder,
    private _chart: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.chart = this._fb.group({
      chartId: '',
      report: '',
      chartName: ['', Validators.required],
      chartType: ['', Validators.required],
      chartDataType: ['', Validators.required],
      sequenceNumber: ['', Validators.required]
    });

    this.label = this._fb.group({
      labelId: '',
      labelName: ['', Validators.required],
      labelParameter: ['', Validators.required],
      labelType: [''],
      calculation: [''],
      labelColor: ['']
    });

    this.propertiesForm = this._fb.group({
      key: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });
    this.getTemplate(dialog.mode, dialog.model);
  }

  getTemplate(mode, model) {
    if ((mode === 'add') && (model === 'chart')) {
      this.dialog.title = "Add Chart";
      this.showChart = true;
      this._chart.getCharts(0, 0, this.dialog.details.report_id).subscribe(data => {
        if (data != null) {
          for (let key of data) {
            let index: number = this.sequnceNumber.findIndex(d => d === key.sequenceNumber);
            this.sequnceNumber.splice(index, 1);
          }
        }
      }, err => this.handleError(err));
      this.chart.controls['report'].setValue(this.dialog.details);
    }

    if ((mode === 'edit') && (model === 'chart')) {

      this.dialog.title = "Update Chart";
      this.showChart = true;
      this.chart.controls['chartId'].setValue(Number(this.dialog.details.chartId));
      this.chart.controls['report'].setValue(this.dialog.details.report);
      this.chart.controls['chartName'].setValue(this.dialog.details.chartName);
      this.chart.controls['chartType'].disable();
      this.chart.controls['chartType'].setValue(this.dialog.details.chartType);
      this.chart.controls['chartDataType'].disable();
      this.chart.controls['chartDataType'].setValue(this.dialog.details.chartDataType);
      this.chart.controls['sequenceNumber'].setValue(this.dialog.details.sequenceNumber);

      Object.assign(this.JsonProperties, JSON.parse(this.dialog.details.property));

      this.showOption = true;
      while (DATAPROPERTY.length > 0) {
        DATAPROPERTY.pop();
      }

      let property = JSON.parse(this.dialog.details.property);
      for (var key in property) {
        let ob = Object();
        var fields = key.split('_');
        ob.propertyName = fields[0];
        ob.key = fields[1];
        ob.value = property[key];
        DATAPROPERTY.push(ob);
      }
      this.propertiesData = new MatTableDataSource<any>(DATAPROPERTY);
      this.setChartDataType(this.dialog.details.chartType, 'update');

    }
    // ---------------------------------------------------Chart Configuration ------------------------


    for (let i = 0; i <= 50; i++) {
      this.chartColor.push(this.getRandomColor());
    }
    while (DATA.length > 0) {
      DATA.pop();
    }
    this.paramList = [];
    this.calculationList = [];


    this.label.controls['labelType'].clearValidators();
    this.showTypeOfLable = false;
    if (this.dialog.details.chartDataType != 'summary') {
      this.label.controls['labelType'].setValidators(Validators.required);
      this.showTypeOfLable = true;
    }  // validation show labeltype only line nad bar 


    if ((mode === 'add') && (model === 'label')) {

      this.dialog.title = "Add Label";
      this.showLabel = true;

      if (this.dialog.details.chartDataType === 'summary') {

        if (this.dialog.details.chartType === "line" || this.dialog.details.chartType === "guage") {
          this.hideColorBox = false; //hide the color box
        }// logic for set one color to summary line chart 

        this._chart.getReportParameterDetails('none').subscribe(data => {
          for (let key of this.dialog.details.chartData) {
            let i = 0;
            for (let search of data) {
              if ((key.labelParameter.param_type === search.param_type) && (key.labelParameter.param_name === search.param_name)) {
                data.splice(i, 1);
              }
              i++;
            }
          }
          this.paramList = data;
        }, err => this.handleError(err));
        //param validation for summary 


        this.showCalculation = true;
        this.label.controls['calculation'].setValidators(Validators.required);

        if (this.dialog.details.chartType === "line") {
          this.displayedColumns = ['select', 'labelName', 'labelParameter', 'labelType', 'calculation'];
          //show calculation, hide labelcolor only when chart line summary 
        } else {
          this.displayedColumns = ['select', 'labelName', 'labelParameter', 'labelType', 'labelColor', 'calculation'];
          //show calculation only when chart data type is summary
        }

      }

      if (this.dialog.details.chartData !== null) {
        for (let x of this.dialog.details.chartData) {
          if (x.labelType == 'X-Axis') {
            this.labelType = ['Y-Axis'];
            break;
          }
        }  //validation of label type    
      }
    }


    if ((mode === 'edit') && (model === 'label')) {
      this.dialog.title = "Update Label";
      this.showUpdateLabel = true;
      this.label.controls['labelId'].setValue(Number(this.dialog.label.labelId));
      this.label.controls['labelName'].setValue(this.dialog.label.labelName);
      this.colorlabel = this.dialog.label.labelColor;
      this.label.controls['labelColor'].setValue(this.dialog.label.labelColor);


      if (this.dialog.details.chartDataType === 'summary') {

        if (this.dialog.details.chartType === "line") {
          this.hideColorBox = false; //hide the color box
        }// logic for set one color to summary line chart 


        this._chart.getReportParameterDetails('none').subscribe(data => {
          this.setParamList(data, this.dialog.label.labelParameter, this.dialog.details.chartData);
        }, err => this.handleError(err));  // Parameters


        this._chart.getCalculationList(this.dialog.label.labelParameter).subscribe(data => {
          if (data != null) {
            this.calculationList = data;
          }
          else {
            this.label.controls['calculation'].setErrors({ 'incorrect': true });
          }
        }, err => this.handleError(err));  // Calculation
        this.showCalculation = true;
        this.label.controls['calculation'].setValue(this.dialog.label.calculation);
        this.label.controls['labelType'].setValue(this.dialog.label.labelType); // set LabelType
        this.label.controls['calculation'].setValidators(Validators.required);
      }

      else {
        this._chart.getReportParameterDetails(this.dialog.label.labelType).subscribe(data => {
          this.setParamList(data, this.dialog.label.labelParameter, this.dialog.details.chartData);
        }, err => this.handleError(err));

        if (this.dialog.details.chartDataType === 'summary') {

          this._chart.getCalculationList(this.dialog.label.labelParameter).subscribe(data => {
            if (data != null) {
              this.calculationList = data;
            }
            else {
              this.label.controls['calculation'].setErrors({ 'incorrect': true });
            }
          }, err => this.handleError(err));  // Calculation
          this.showCalculation = true;
          this.label.controls['calculation'].setValue(this.dialog.label.calculation);
          this.label.controls['calculation'].setValidators(Validators.required);
        } // show when line and bar chart type of summary
        this.label.controls['labelType'].setValue(this.dialog.label.labelType); // set LabelType
      }
    }

    if (mode === 'delete') {
      if (this.dialog.model === 'chart') {
        this.title = this.dialog.details.chartName;
      }
      else {
        this.title = this.dialog.label.labelName;
      }
      this.showDelete = true;
    }

    if ((mode === 'color view') && (model === 'color')) {
      this.showColorBoxModel = true;
    }
  }


  setParamList(data, selectedParam, compareList) {
    let compare = [];
    for (let key of compareList) {
      if ((key.labelParameter.param_type === selectedParam.param_type) && (key.labelParameter.param_name === selectedParam.param_name)) { }
      else { compare.push(key.labelParameter); }
    }
    for (let key of compare) {
      let i = 0;
      for (let search of data) {
        if ((key.param_type === search.param_type) && (key.param_name === search.param_name) && (key.id === search.id)) {
          data.splice(i, 1);
        }
        i++;
      }
    }
    this.paramList = data;
    this.editParam = selectedParam;
    this.compareParam(this.paramList, this.editParam);
  }


  onlabelTypeChange(value) {
    this.paramList = [];
    let compareParamList = [];
    this.hideColorBox = true;
    if (value === 'X-Axis') {
      this.hideColorBox = false;
    }
    if ((this.dialog.mode === 'add') && (this.dialog.model === 'label')) {
      this._chart.getReportParameterDetails(value).subscribe(data => {
        for (let list1 of this.dialog.details.chartData) {
          if (list1.labelType === value) {
            compareParamList.push(list1.labelParameter);
          }
        }
        for (let list2 of DATA) {
          if (list2.labelType === value) {
            compareParamList.push(list2.labelParameter);
          }
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
        this.paramList = data;
      }, err => this.handleError(err));  // Apply validation on paramList
    }

    if ((this.dialog.mode === 'edit') && (this.dialog.model === 'label')) {
      this._chart.getReportParameterDetails(value).subscribe(data => {
        for (let key of this.dialog.details.chartData) {
          if ((key.labelParameter.param_type === this.dialog.label.labelParameter.param_type) && (key.labelParameter.param_name === this.dialog.label.labelParameter.param_name)) { }
          else { compareParamList.push(key); }
        }
        this.setParamList(data, this.dialog.label.labelParameter, compareParamList);
      }, err => this.handleError(err));
    }
  }

  compareParam(param1: any, param2: any) {
    return param1 && param2 ? param1.param_type === param2.param_type && param1.param_name === param2.param_name : param1 === param2;
  }
  getRandomColor() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }
  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 3 : 10;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 3 : 10;
  }
  setColorValue(value, show) {
    this.colorlabel = value;
    this.label.controls['labelColor'].setValue(value);
    this.showColorBox = show;
  }

  openColorBox(value) {
    this.showColorBox = value;
  }

  addLabelToTable() {

    let flag = 0;
    if (this.label.controls['labelType'].value === 'Y-Axis') {
      for (let key of this.dialog.details.chartData) {
        if (key.labelType === 'Y-Axis') {
          if (key.labelName === this.label.controls['labelName'].value) {
            flag = 1;
          }
        }
      }

      for (let data of DATA) {
        if (data.labelType === 'Y-Axis') {
          if (data.labelName === this.label.controls['labelName'].value) {
            flag = 1;
          }
        }
      }
      if (flag == 1) {
        this.label.controls['labelName'].setErrors({ 'incorrect': true });
      }
    } //label Name validation Monitoring Chart


    if (this.dialog.details.chartDataType === 'summary') {
      flag = 0;
      for (let key of this.dialog.details.chartData) {
        if (key.labelName === this.label.controls['labelName'].value) {
          flag = 1;
        }
      }
    }
    for (let data of DATA) {
      if (data.labelName === this.label.controls['labelName'].value) {
        flag = 1;
      }
    }
    if (flag == 1) {
      this.label.controls['labelName'].setErrors({ 'incorrect': true });
    }//label Name validation Summary chart


    if (this.label.controls['labelType'].value === 'X-Axis') {
      this.labelType = ['Y-Axis'];
    } // label type validation

    if (this.dialog.details.chartType === 'bar') {
      if (this.label.controls['labelType'].value === 'Y-Axis') {
        let count = 0;
        for (let countKey of this.dialog.details.chartData) {
          if (countKey.labelType === 'Y-Axis') {
            count = count + 1;
          }
        }
        for (let countKey of DATA) {
          if (countKey.labelType === 'Y-Axis') {
            count = count + 1;
          }
        }
        if (count >= 4) { this.label.controls['labelType'].setErrors({ 'incorrect': true }); }
      } // validation ->do not add more then 4 bars for bar chart  
    }

    let flagColor = 0;

    // do not apply validation to color when chart is summary line
    if ((this.dialog.details.chartType === "line") && (this.dialog.details.chartDataType === 'summary')) { }
    else {
      for (let data of this.dialog.details.chartData) {
        if (this.label.controls['labelColor'].value === data.labelColor) {
          flagColor = 1;
          break;
        }
      }
      for (let data of DATA) {
        if (this.label.controls['labelColor'].value === data.labelColor) {
          flagColor = 1;
        }
      }
      if (flagColor == 1) {
        this.label.controls['labelColor'].setErrors({ 'incorrect': true });
      } // validation ->user select unique label color
    }



    if (this.dialog.details.chartType === 'guage') {
      if (this.dataSource.data.length == 1) {
        this.label.controls['labelParameter'].setErrors({ 'incorrect': true });
      }
    }


    if (this.label.valid) {

      switch (this.dialog.details.chartType) {

        case 'pie':
        case 'doughnut':
          this.label.value.labelType = 'Y-Axis';
          break;
        case 'guage':
          this.label.value.labelType = 'Z-Axis';
          break;
        case 'line':
        case 'bar':
          if (this.dialog.details.chartDataType === 'summary') {
            this.label.value.labelType = 'X-Axis';
          }
          break;
      }
      // set label type to chart


      DATA.push(this.label.value);
      this.dataSource = new MatTableDataSource(DATA);

      this.validLabel = true;
      this.label.controls['labelName'].setValue('');
      this.label.controls['labelParameter'].setValue('');
      this.paramList = [];
      this.label.controls['labelType'].setValue('');
      this.label.controls['labelColor'].setValue('');
      this.label.controls['calculation'].setValue('');
      this.calculationList = [];

      if (this.dialog.details.chartDataType === 'summary') {
        this._chart.getReportParameterDetails('none').subscribe(data => {
          let compareParamList = [];
          for (let list1 of this.dialog.details.chartData) {
            compareParamList.push(list1.labelParameter);
          }
          for (let list2 of DATA) {
            compareParamList.push(list2.labelParameter);
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
          this.paramList = data;
        }, err => this.handleError(err));  // Apply validation on paramList
      }

    }
  }


  removeLabel() {
    let paramArray = [];
    this.selection.selected.forEach(item => {
      paramArray.push(item.labelParameter);
      if (item.labelType === 'X-Axis') {
        this.labelType = ['X-Axis', 'Y-Axis'];
      }
      let index: number = this.data.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
    });
    this.selection = new SelectionModel<Element>(true, []);
    if (this.dataSource.data.length == 0) {
      this.validLabel = false;
    }
    else {
      this.validLabel = true;
    }
    this.label.controls['labelName'].setValue('');
    this.label.controls['labelParameter'].setValue('');
    this.label.controls['labelType'].setValue('');
    this.label.controls['labelColor'].setValue('');
    this.label.controls['calculation'].setValue('');
    this.calculationList = [];
    if (this.dialog.details.chartDataType === 'summary') {
      for (let ArrayList of paramArray) {
        this.paramList.push(ArrayList);
      }
    } else {
      this.paramList = [];
    }
  }


  onlabelParameterChange(value) {
    this.calculationList = null;
    if (this.showCalculation) {
      this._chart.getCalculationList(value).subscribe(data => {
        if (data != null) {
          this.calculationList = data;
        }
        else {
          if (this.dialog.details.chartType === 'pie') {
            this.label.controls['calculation'].setErrors({ 'incorrect': true });
          }
        }
      }, err => this.handleError(err));
      this.label.controls['calculation'].setValidators(Validators.required);
    }
  }

  updateLabel(value) {
    let labelName = [];
    let flagAxis = 0;
    let flagColor = 0;
    for (let key of this.dialog.details.chartData) {
      if (this.dialog.label.labelName !== key.labelName) {
        labelName.push(key.labelName);
        if (key.labelType === 'X-Axis') { flagAxis = 1; }
        if (key.labelColor === value.labelColor) { flagColor = 1; }
      }
    }

    for (let name of labelName) {
      if (name === value.labelName) {
        this.label.controls['labelName'].setErrors({ 'incorrect': true });
        break;
      }
    }  // set validation label name must be unique

    if (this.dialog.details.chartDataType != 'summary') {
      if (flagAxis == 1) {
        if (this.label.controls['labelType'].value === 'X-Axis') {
          this.label.controls['labelType'].setErrors({ 'incorrect': true });
        }
      }   // set validation label type do not add xAxis if already added
    }

    if (flagColor == 1) {
      if (this.label.controls['labelColor'].value === 'X-Axis') {
        this.label.controls['labelColor'].setErrors({ 'incorrect': true });
      }
    }   // set validation label type do not add xAxis if already added

    if (this.label.valid) {
      this.onSubmit(value);
    }
  }


  onSubmit(value) {
    if ((this.dialog.mode === 'edit') && (this.dialog.model === 'chart')) {
      value.chartDataType = this.dialog.details.chartDataType;
      value.chartType = this.dialog.details.chartType;
      value.property = JSON.stringify(this.JsonProperties);
    }
    this.update(value, this.dialog.mode, this.dialog.model, this.dialog.details, this.JsonProperties);
  }

  update(req, mode, model, details, property) {
    this.loading = true;

    switch (mode) {
      case MODE.ADD:
        this._chart
          .addChartLabel(req, model, details, property)
          .subscribe(
            res => this._dialogRef.close(res),
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this._chart
          .updateChartLabel(req, model, details)
          .subscribe(
            res => this._dialogRef.close(req),
            err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._chart
          .deleteChartLabel(req, model, details)
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
    this._chart.throwError(err);
    this.chart.enable();
    this.loading = false;
  }



  // Color Box For Summary line Chart
  colorSelected(color) {
    this.selectedColor = color;
  }

  updateColor() {
    let req = Object();
    req.color = this.selectedColor;
    this._chart
      .updateChartLabel(req, 'color', this.dialog.details.chartId)
      .subscribe(
        res => this._dialogRef.close(res),
        err => this.handleError(err)
      );
  }

  setChartDataType(type, mode = '') {

    if (mode !== 'update') {
      this.JsonProperties = {};
      while (DATAPROPERTY.length > 0) {
        DATAPROPERTY.pop();
      }
    }

    this.propertiesKey = '';
    this.propertiesForm.controls['value'].setValue('');

    this.showOption = false;

    if (type === 'pie' || type === 'doughnut' || type === 'guage') {
      this.chartDataTypes = ['summary'];
    } else {
      this.chartDataTypes = ['summary', 'monitoring'];
    }

    this.chartType = type;
    this.showOption = true;

    this._chart.getPropertiesForChart(this.chartType).subscribe(data => {
      if (mode === 'update') {
        if (data != null) {
          this.apiResponseData = data;
          this.Options = Object.keys(data);
        }
      } else {
        this.apiResponseData = data;
        this.Options = Object.keys(data);
      }
    }, err => this.handleError(err));

    // SHOW JSON DATA EXAMPLE
    this._chart.getJOSNExample(this.chartType).subscribe((data: any) => {
      if (data) {
        var ar = data.example;
        this.JSONExampleData = data;//JSON.parse(ar);
      } else {
        this.JSONExampleData = null;
      }
    }, err => this.handleError(err));
    //----------------------------------------------
  }

  onOptionChange(event) {
    this.Property = this.apiResponseData[event];
    this.PropertyKeys = null;
  }

  onPropertyChange(event) {
    this.propertyName = event.propertyName;
    this.PropertyKeys = event.properties;
  }

  // onPropertyKeyChange(event) {
  // }

  addJSON(ob: any, properties) {

    const result = {};
    result["key"] = ob.key.key;
    result["dataType"] = ob.key.dataType;
    result["value"] = ob.value;
    result["propertyName"] = this.propertyName;

    var valid = this.validations(result);
    if (valid) {
      this.propertiesKey = '';

      this.propertiesForm.controls['value'].setValue('');
      // this.PropertyKeys = null;

      DATAPROPERTY.push(result);

      this.propertiesData = new MatTableDataSource<any>(DATAPROPERTY);
      let key = ob.key.key + "_" + this.propertyName;
      this.JsonProperties[key] = ob.value;

      // this.Property = [];
    }

  }

  showJSON() {
    this.showTable = false;
  }

  closeJSON() {
    this.showTable = true;
  }

  removeProperty(properties) {
    let paramArray = [];
    this.selection.selected.forEach(item => {
      paramArray.push(item.key);  // remove from option list
      for (let value in this.JsonProperties) {
        if (value === item.key) {
          delete this.JsonProperties[value];
        }
      }
      let index: number = this.dataProperty.findIndex(d => d === item);
      this.propertiesData.data.splice(index, 1);
      this.propertiesData = new MatTableDataSource<Element>(this.propertiesData.data);
    });
    this._chart.getPropertiesForChart(this.chartType).subscribe(data => {
      for (let key of data) {
        for (let value of paramArray) {
          if (key.propertyKey === value) {
            properties.push(key);
          }
        }
      }  // remove from option list
    }, err => this.handleError(err));
    this.selection = new SelectionModel<Element>(true, []);
  }

  validations(formValue) {
    var letter = /^[a-zA-Z]+$/;
    var number = /^[0-9]+$/;
    var color = /^#[a-fA-F0-9]+$/;  // #D2691E

    switch (formValue.dataType) {
      case 'boolean':
        //Check Boolean
        if (formValue.value == 'true' || formValue.value == 'false') {
          return true;
        } else {
          this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
          this.invalidData = "boolean";
          return false;
        }
      case 'string':
        //Check String      
        if ((formValue.value.match(letter))) {
          return true;
        } else {
          this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
          this.invalidData = "string";
          return false;
        }

      case 'color':


        if (formValue.value.startsWith('#') && formValue.value.length === 7) {

          if ((formValue.value.match(color))) {
            return true;
          } else {
            this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
            this.invalidData = "color";
            return false;
          }

        } else {

          if ((formValue.value.match(letter))) {
            return true;
          } else {
            this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
            this.invalidData = "color";
            return false;
          }

        }



      case 'object':
        //Check Object      
        try {
          var value = JSON.parse(formValue.value);
          if ((Array.isArray(value) === false) && (typeof value !== 'number')) {
            return true;
          } else {
            this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
            this.invalidData = "object";
            return false;
          }
        } catch (e) {
          this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
          return false;
        }
      case 'number':
        if ((formValue.value.match(number))) {
          return true;
        } else {
          this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
          this.invalidData = "number";
          return false;
        }

      case 'array':
        try {
          if (Array.isArray(JSON.parse(formValue.value))) {
            return true;
          } else {
            this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
            this.invalidData = "array";
            return false;
          }
        } catch (e) {
          this.propertiesForm.controls['value'].setErrors({ 'incorrect': true });
          return false;
        }
    }
  }
}

