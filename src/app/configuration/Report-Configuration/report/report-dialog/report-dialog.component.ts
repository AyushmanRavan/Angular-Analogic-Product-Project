import { Component, Inject, ViewChildren, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ConfigurationService } from '../../../configuration.service';
import { MODE } from '../../../shared/config';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {

  public PieChartOptions: any = {
    legend: { position: 'right' }
  };
  
  report: FormGroup;
  machineTypes: string[] = [];
  loading: boolean;
  SummaryData = [];
  MonitoringData = [];
  summaryColumns = [];
  monitoringColumns = [];
  summary: boolean = false;
  monitoring: boolean = false;
  chart: boolean = false;
  showhighlight: boolean = false;
  view: boolean = false;
  errhidden: boolean = false;
  errMessage: string;
  highlight: string;
  objectKeys = Object.keys;
  //For Chart 
  chartReportData = [];
  pieChartReportData = [];
  Charts: any = { pie: [], lineBar: [] };
  intData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  bitData = [101, 111, 100, 101, 111, 100, 101, 111, 100, 111];
  datetimeData = ['dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss', 'dd-mm-yy hh:mm:ss'];
  varcharData = ['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'];
  floatData = [1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9, 10.10];
  count = 0;
  filterTypes=['shift','datetime'];
  showInterval:boolean=false;

  public ChartOptions: any = {
    options: {
      scaleShowValues: true,
      responsive: true,
      elements: {
        line: { tension: 0 }
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
          }
        }]
      }
    },
  };

  // Pie
  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: number[] = [1, 2, 3];
  public pieChartType: string = 'pie';

  constructor(
    private _dialogRef: MatDialogRef<ReportDialogComponent>,
    private _fb: FormBuilder,
    private _report: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.report = this._fb.group({
      report_id: '',
      report_name: ['', Validators.required],
      machine_type: ['', Validators.required],
      filter_type:  ['',Validators.required],
      interval:[''] 
    });
    this._report.getmachineType().subscribe(data => {
      this.machineTypes = data;
    }, err => this.handleError(err)); // get machines for report add and update

    if (dialog.mode === MODE.UPDATE) { 
      if(dialog.details.filter_type==='shift'){
        this.showInterval=true;
      } 
    
      this.report.setValue(dialog.details); 
    }
    if (dialog.mode === MODE.VIEW) { this.view = false; this.getTables(); }
  }

  getTables() {
    this.summary = false;
    this.monitoring = false;
    this._report.getHeadersByReportID(this.dialog.details.report_id, 'monitoring').subscribe(data => {
      if (data != null) {
        for (let key of data) {
          this.monitoringColumns.push(key.heading);
        }
        var ob = {};
        for (let key of this.monitoringColumns) {
          let pro = key; ob[pro] = "NULL";
        }
        for (let i = 1; i <= 2; i++) {
          this.MonitoringData.push(ob)
        }
        this.monitoring = true;
      } else { this.count = this.count + 1; }
    }, err => this.handleError(err)); //For Monitoring table

    this._report.getHeadersByReportID(this.dialog.details.report_id, 'summary').subscribe(data => {
      if (data != null) {
        for (let key of data) {
          this.summaryColumns.push(key.heading);
        }
        var ob = {};
        for (let key of this.summaryColumns) {
          let pro = key; ob[pro] = "NULL";
        }
        for (let i = 1; i <= 2; i++) {
          this.SummaryData.push(ob)
        }
        this.summary = true;
      } else { this.count = this.count + 1; }
    }, err => this.handleError(err));//For Summary table

    this.getCharts();
 
  }

  // Logic for Chart----------------------------------------------------------------------
  getCharts() {
    this.chart = false;
    this._report.getChartOnView(this.dialog.details.report_id).subscribe(data => {
      this.setChartData(data);
    }, err => this.handleError(err));
  }

  setChartData(data) {
    if (data != null) {
      for (let chartData of data) {
        let object = Object();
        object.chartName = chartData.chartName;
        object.chartType = chartData.chartType;
        object.sequenceNumber = chartData.sequenceNumber;
        switch (object.chartType) {
          case 'line':
          case 'bar':
            object.chartColor = [];
            object.chartData = [];
            object.chartLabel = [];
            if (chartData.chartData != null) {
              if (chartData.chartData.X != null) {
                object.chartLabelColor = chartData.chartData.X[0].chartColor;
                switch (chartData.chartData.X[0].parameter.param_datatype) {
                  case 'bit': object.chartLabel = this.bitData.map(e => e);
                    break;
                  case 'int': object.chartLabel = this.intData.map(e => e);
                    break;
                  case 'float': object.chartLabel = this.floatData.map(e => e);
                    break;
                  case 'datetime': object.chartLabel = this.datetimeData.map(e => e);
                    break;
                  case 'varchar': object.chartLabel = this.varcharData.map(e => e);
                    break;
                  default: object.chartLabel = this.varcharData.map(e => e);
                    break;
                } // for label
              }

              for (let colors of chartData.chartData.Y) {
                let color = Object();
                if (chartData.chartType === 'line') {
                  color.backgroundColor = "transparent";
                  color.borderColor = colors.chartColor;
                } else {
                  color.backgroundColor = colors.chartColor;
                  color.borderColor = colors.chartColor;
                }

                object.chartColor.push(color);
              }// for colors

              for (let key of chartData.chartData.Y) {
                let label = '';
                let Array = [];
                switch (key.parameter.param_datatype) {
                  case 'bit': Array = this.bitData.map(e => e);
                    break;
                  case 'int': Array = this.intData.map(e => e);
                    break;
                  case 'float': Array = this.floatData.map(e => e);
                    break;
                  case 'datetime': Array = this.datetimeData.map(e => e);
                    break;
                  case 'varchar': Array = this.varcharData.map(e => e);
                    break;
                  default: Array = this.varcharData.map(e => e);
                    break;
                }
                label = key.labelName;
                let datasetObject = Object();
                datasetObject.data = Array.map(e => e);
                datasetObject.label = label;
                object.chartData.push(datasetObject);
              } // for chartData
              this.chartReportData.push(object);
            }

            break;
          case 'pie':
            object.chartColor = [];
            object.chartData = [];
            object.chartLabel = [];
            let colors = [];
            let dumData = 50.20;
            if (chartData.chartData.Y != null) {
              for (let key of chartData.chartData.Y) {
                colors.push(key.chartColor);
                object.chartLabel.push(key.labelName);
                object.chartData.push(dumData);
                dumData = dumData + 10;
              }
              object.chartColor.push({ backgroundColor: colors });
              this.pieChartReportData.push(object);
            }
            break;
        }
      }//outer loop

       this.pieChartReportData.sort(function (a, b) {
         return a.sequenceNumber - b.sequenceNumber;
       });
       this.chartReportData.sort(function (a, b) {
        return a.sequenceNumber - b.sequenceNumber
        });
        this.setObjectForChart(this.pieChartReportData, this.chartReportData);this.getHighlight();
    } else { this.count = this.count + 1;this.getHighlight(); }
    
  }

setObjectForChart(pieChartReportData, chartReportData) {
       this.Charts.pie = this.pieChartReportData;
       this.Charts.lineBar = this.chartReportData;
       this.chart = true;
}

  setChartDetails(index, chartType, attribute) {
    for (let key in this.Charts) {
      if (key === chartType) {
        let Array = this.Charts[key];
        switch (attribute) {
          case 'datasets' : return Array[index].chartData;
          case 'labels'   : return Array[index].chartLabel;
          case 'chartType': return Array[index].chartType;
          case 'colors'   : return Array[index].chartColor;
          case 'options'  : return this.ChartOptions.options;
        }
      }
    }
  }

  // End Logic for Chart----------------------------------------------------------------------

  getHighlight() {
    this.showhighlight = false;
    let request = Object();
    request.machineId = 0;
    request.reportId = this.dialog.details.report_id;
    this._report.getHighlightOnView(request).subscribe(data => {
      if (data) {
        this.highlight = data;
        this.showhighlight = true;
        this.reset();
      } else { this.count = this.count + 1; this.reset();}
    }, err => this.handleError(err));
  }

  reset() {
    if ((this.chart==true)||(this.summary==true)){
      this.errhidden = true;
      this.view = true;
    }
   
    if((this.showhighlight)||(this.monitoring)){
      this.errhidden = true;
      this.view = true;
    }
    
    
    if (this.count == 4) { this.handleEmptyError(1); }

  }


  onSubmit() {
    if(this.report.controls["filter_type"].value==='shift'){
      if(this.report.controls["interval"].value===null){
        this.report.controls['interval'].setErrors({ 'incorrect': true });  
      }else{
        let interval=''+this.report.controls["interval"].value;
        this.report.controls["interval"].setValue(interval);
      } 
    }else{
      this.report.controls["interval"].setValue('');
    }
    if (this.report.valid) {
         this.update(this.report.value, this.dialog.mode);
    }
  }

  update(report, mode) {
    this.report.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._report
          .ReportConfiguration(report, mode)
          .subscribe(
          newAlarm => this._dialogRef.close(newAlarm),
          err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this._report
          .ReportConfiguration(report, mode)
          .subscribe(
          res => this._dialogRef.close(report),
          err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._report
          .ReportConfiguration(report.report_id, mode)
          .subscribe(
          res => this._dialogRef.close(report),
          err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }
  private handleEmptyError(err) {
    this.errMessage = this._report.getErrorMessage(err);
    this.errhidden = false;
    this.view = true;
    this.dialog.details.report_name="";
  }
  private handleError(err) {
    this._report.throwError(err);
    this.report.enable();
    this.loading = false;
  }
  onFilterTypeChange(value){
    this.showInterval=false;
    if(value==='shift'){
      this.showInterval=true;
    }else{
      this.report.controls['interval'].setErrors(null); 
    }
  }
}

