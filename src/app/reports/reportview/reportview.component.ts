import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { ReportsService } from "../reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { PieChart } from "../../_helper/pie-chart";
import { LineChart } from "../../_helper/line-chart";
import { GuageChart } from "../../_helper/guage-chart";

@Component({
  selector: 'app-reportview',
  templateUrl: './reportview.component.html',
  styleUrls: ['./reportview.component.scss']
})

export class ReportviewComponent implements AfterViewInit {


  compareProperty = {
    type: "semi",
    label: "Speed",
    append: "km/hr",
    min: 0,
    max: 100,
    cap: 'round',
    thick: 15,
    size: 200
  }
 
  objectKeys = Object.keys;
  chartAtributes: any[];

  lineBarReportData: any[] = [];
  piechartReportData: any[] = [];
  doughnutchartReportData: any[] = [];
  guagechartReportData: GuageChart[] = [];

  public ChartOptions: any = {
    scaleShowValues: true,
    responsive: true,
    elements: {
      line: {
        tension: 0,
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
        }
      }]
    }
  };

  public ChartOptionsForSummary: any = {

    responsive: true,
    scales: {
      xAxes: [
        {
          barPercentage: 0.2
        }
      ],
      yAxes: [
        {
          ticks: {
            min: 0
          }
        }
      ]
    }
  }

  ChartArray: any[] = [];
  ChartName: any[] = [];

  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  reportId: number;
  oeeType: any;
  shift: any;

  parameterList = [];
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  paramListForMonitoring = [];
  paramListForSummary = [];

  Charts: any = { pie: [], lineBar: [], guage: [] };
  chartObjectRefrence: any;

  guageChart = [];
  keyForMonitoring = [];
  keysForSummary = [];
  highlight: string = '';
  datasetLength: number;
  dataSource1 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  subscriber: Subscription;
  reportVal: any;
  pdfData: any;
  pdfDataForSummary: any;
  chartDetails: any[];
  chartResponse: any[];
  pdfReady: boolean;
  tableType1 = "monitoring";
  tableType2 = "summary";
  reportHeading: string;
  HeadersForMonitoring = [];
  HeadersForSummary = [];

  loadMonitoring: boolean = true;
  loadSummary: boolean = true;
  loadHighlight = true;
  showChart = true;
  loading: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;

  thresholdConfig = {
    '0': { color: 'red', font: '5px' },
    '50': { color: 'orange' },
    '80': { color: 'green', font: '5px' }
  };


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private rs: ReportsService, private error: GlobalErrorHandler, private _intl: MatPaginatorIntl) {
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  downloadCanvas(event) {

    if (this.ChartArray.length != 0) {
      this.ChartArray.length = 0;
    } //empty

    if (this.ChartName.length != 0) {
      this.ChartName.length = 0;
    } //empty

    var canvas = document.getElementsByTagName('canvas');
    for (let i = 0; i < canvas.length; i++) {
      var imgData = document.getElementsByTagName('canvas')[i].toDataURL('image/png');
      this.ChartArray.push(imgData);
    }

    for (let key of this.objectKeys(this.Charts)) {
      for (let chart of this.Charts[key]) {
        this.ChartName.push(chart.chartName)
      }
    }


  }


  onSelect(event: any) {
    // clear map data.
    // this.chartDataDetails.clear();

    this.loading = true;
    this.pdfReady = false;
    this.Errormsg = true;
    this.loadMonitoring = true;
    this.loadSummary = true;
    this.loadHighlight = true;
    this.showChart = true;
    this.reportHeading = event.reportValue.reportName.report_name;
    this.reportVal = { ...event.values, type: "dynamic", reportName: this.reportHeading.charAt(0).toUpperCase() + this.reportHeading.slice(1) };
    this.plant = event.reportValue["plant"];
    this.department = event.reportValue["department"];
    this.assembly = event.reportValue["assembly"];
    this.machineId = event.reportValue["machine"];
    this.from = this.rs.formatDate(event.reportValue["from"]);
    this.to = this.rs.formatDate(event.reportValue["to"]);
    this.interval = event.reportValue["interval"];
    this.reportId = event.reportValue.reportName.report_id;
    this.shift = event.reportValue["shift"];
    this.oeeType = event.reportValue["filterType"];

    this.ChartDetails(this.reportId, this.machineId);

    // this.headersValueForSummary(this.reportId, this.tableType2);

    // this.getHighlight();

    // this.headersValueForMonitoring(this.reportId, this.tableType1);

  }

  //******************************************Summary Table*********************************
  private headersValueForSummary(id, type) {

    this.rs.getHeadersForSummary(id, type).subscribe(data => {

      if (this.paramListForSummary.length != 0) {
        this.paramListForSummary.length = 0;
      } //empty
      if (this.keysForSummary.length != 0) {
        this.keysForSummary.length = 0;
      } //empty
      if (this.HeadersForSummary.length != 0) {
        this.HeadersForSummary.length = 0;
      } //empty
      if (this.pdfDataForSummary !== undefined) {
        this.pdfDataForSummary.length = 0;
      } //empty

      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          this.HeadersForSummary.push(data[i].heading) //Headers for table sumary
        }
        for (let i = 0; i < data.length; i++) {
          if (data[i].parameter != null) {
            data[i].parameter.calculation = data[i].calculation;
            this.paramListForSummary.push(data[i].parameter)     //param arrya to send to apicall
            this.keysForSummary.push(data[i].parameter.column_name)  //for matching key with api data
          }
        }
        this.getReportForSummary(this.HeadersForSummary, this.paramListForSummary);
      }
    }, err => this.handleError(err));

  }
  private getReportForSummary(HeadersForSummary, paramListForSummary) {

    if (this.displayedColumns.length != 0) {
      this.displayedColumns.length = 0;
    } //empty
    if (this.columnsToDisplay.length != 0) {
      this.columnsToDisplay.length = 0;
    } //empty
    this.rs.getDynamicReportForSummary(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval,
      this.paramListForSummary, this.oeeType, this.shift).subscribe(data => {

        if (data != null) {
          for (let i = 0; i < HeadersForSummary.length; i++) {
            data[i].headers = HeadersForSummary[i];
          }
          for (let key in data[0]) {
            this.displayedColumns.push(key);
            this.columnsToDisplay.push(key);
          }
          this.setTableDataForSummary(data);
        }
      }, err => this.handleError(err));
  }

  setTableDataForSummary(data) {
    if (data != null) {
      this.dataSource2 = new MatTableDataSource<any>(data);
      this.pdfDataForSummary = data;
      this.pdfReady = true;
      this.loadSummary = false;
    } else {
      this.loadSummary = true;
    }
  }


  //******************************************Monitoring Table*********************************
  private headersValueForMonitoring(id, type) {
    this.rs.getHeadersForMonitoring(id, type).subscribe(data => {

      if (this.paramListForMonitoring.length != 0) {
        this.paramListForMonitoring.length = 0;
      } //Headers empty
      if (this.HeadersForMonitoring.length != 0) {
        this.HeadersForMonitoring.length = 0;
      } //empty
      if (this.keyForMonitoring.length != 0) {
        this.keyForMonitoring.length = 0;
      } //empty
      if (this.pdfData !== undefined) {
        this.pdfData.length = 0;
      } //empty
      this.HeadersForMonitoring = [];
      this.HeadersForMonitoring.push('Start Date-Time');
      this.HeadersForMonitoring.push('End Date-Time');
      if (data != null) {
        for (let i = 2; i < data.length; i++) {
          this.HeadersForMonitoring.push(data[i].heading) //Headers for table
        }
        for (let i = 0; i < data.length; i++) {
          if (data[i].parameter != null) {
            data[i].parameter.calculation = data[i].calculation;
            this.paramListForMonitoring.push(data[i].parameter)     //param arrya to send to api
            this.keyForMonitoring.push(data[i].parameter.column_name)  //for matching key with api data
          }
        }
        this.getReportForMonitoring(this.paramListForMonitoring, this.keyForMonitoring);
      }
    }, err => this.handleError(err));

  }
  private getReportForMonitoring(paramListForMonitoring, keyForMonitoring) {
    this.rs.getDynamicReportForMonitoring(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval,
      this.paramListForMonitoring,
      this.oeeType, this.shift,
      0, 0
    ).subscribe(data => {
      this.setTableDataForMonitoring(data);
    }, err => this.handleError(err));
  }

  setTableDataForMonitoring(data) {
    if (data != null) {
      this.dataSource1 = new MatTableDataSource<any>(data);
      this.dataSource1.paginator = this.paginator;
      let tempData = this.rs.prioritizeColumns(data);
      this.pdfData = tempData;
      this.pdfReady = true;
      this.loadMonitoring = false;
    } else {
      this.loadMonitoring = true;
    }
  }
  //******************************************Highlight*********************************
  getHighlight() {
    this.highlight = '';
    this.rs.getHighLightForTable(this.reportId, this.plant, this.department, this.assembly, this.machineId,
      this.from, this.to, this.interval, this.paramListForSummary, this.oeeType, this.shift).subscribe(data => {

        if (data) {
          this.highlight = data;
          this.loadHighlight = false;
          this.pdfReady = true;
        } else {
          this.loadHighlight = true;
        }
      }, err => this.handleError(err));
  }

  //******************************************Charts*********************************
  private ChartDetails(reportId, machineId) {

    if (this.piechartReportData.length != 0) {
      this.piechartReportData.length = 0;
    } ///empty

    if (this.doughnutchartReportData.length != 0) {
      this.doughnutchartReportData.length = 0;
    } ///empty

    if (this.guagechartReportData.length != 0) {
      this.guagechartReportData.length = 0;
    } ///empty

    if (this.lineBarReportData.length != 0) {
      this.lineBarReportData.length = 0;
    } ///empty

    if (this.Charts.pie.length != 0) {
      this.Charts.pie.length = 0;
    } ///empty

    if (this.Charts.lineBar.length != 0) {
      this.Charts.lineBar.length = 0;
    } ///empty

    if (this.Charts.guage.length != 0) {
      this.Charts.guage.length = 0;
    } ///empty


    this.rs.getChartDetails(reportId, machineId).subscribe(data => {
      if (data !== null) {
        this.chartAtributes = data;
        this.chartAtributes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        for (let chart of this.chartAtributes) {
          this.parameterList = []; 

          if (chart.chartData !== null) {

            if (chart.chartData.X.length != 0) {
              for (let chartdata of chart.chartData.X) {
                this.parameterList.push(chartdata.parameter);
              }
            }
            if (chart.chartData.Y.length != 0) {
              for (let chartdata of chart.chartData.Y) {
                this.parameterList.push(chartdata.parameter);
              }
            }

            this.setChart(this.parameterList, chart, chart.chartId, chart.chartType);
            this.showChart = false;
            this.pdfReady = true;
          }
        }
      }
    }, err => this.handleError(err));
  }

  setChart(paramList, chartAtributes, chartId, chartType) {
    this.rs.getChartData(chartId, this.plant, this.department, this.assembly, this.machineId,
      this.from, this.to, this.interval, paramList, this.oeeType, this.shift, 0, 0).subscribe(chartData => {

        let tempObject = { ...chartAtributes, reportData: { ...chartData } };

        switch (tempObject.chartType) {
          case 'line':
          case 'bar':
            let lineChartObject = new LineChart(tempObject);
            this.lineBarReportData.push(lineChartObject);
            this.lineBarReportData.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
            this.Charts.lineBar = [...this.lineBarReportData];
            break;
          case 'pie':
          case 'doughnut':
            let pieChartObject = new PieChart(tempObject);
            this.piechartReportData.push(pieChartObject);
            this.piechartReportData.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
            this.Charts.pie = [...this.piechartReportData];

            break;
          case 'guage':
            let guageChartObject = new GuageChart(tempObject);
            this.guagechartReportData.push(guageChartObject);
            this.guagechartReportData.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
            this.Charts.guage = [...this.guagechartReportData];

            break;
        }

        // switch (chartType) {
        //   case 'line':
        //   case 'bar':
        //     this.callLineBarChart(chartAtributes, chartData);
        //     break;
        //   case 'pie':
        //   case 'doughnut':
        //     this.callPieDoughnutChart(chartAtributes, chartData);
        //     break;
        //   case 'guage':
        //     this.callGuageChart(chartAtributes, chartData);
        //     break;
        // }

      });
  }


  // setChartObjectReference(index, chartType, attribute, isFirstCall) {

  //   if (isFirstCall) {
  //     this.getChartObjectRefrence(index, chartType);
  //     return this.setChartDataThroughObjectRefrence(chartType, attribute);
  //   }
  //   else {
  //     return this.setChartDataThroughObjectRefrence(chartType, attribute);
  //   }
  // }

  // getChartObjectRefrence(index, chartType) {
  //   for (let key in this.Charts) {
  //     if (key === chartType) {
  //       let ArrayForChart = this.Charts[key];
  //       this.chartObjectRefrence = new PieChart(ArrayForChart[index]);
  //     }
  //   }
  // }


  // setChartDataThroughObjectRefrence(chartType, attribute) {
  //   for (let key in this.Charts) {
  //     if (key === chartType) {

  //       switch (attribute) {
  //         case 'datasets':
  //           return this.chartObjectRefrence.chartData;
  //         case 'labels':
  //           return this.chartObjectRefrence.chartLabel;
  //         case 'chartType':
  //           return this.chartObjectRefrence.chartType;
  //         case 'colors':
  //           return this.chartObjectRefrence.chartColor;
  //         case 'legend':
  //           return this.chartObjectRefrence.legend;
  //         case 'options':
  //           return this.chartObjectRefrence.property;
  //       }
  //     }
  //   }
  // }


  // callLineBarChart(chartAtributes, data) {

  //   if ((chartAtributes != null) && (data != null)) {
  //     let object = Object();
  //     object.chartDataType = chartAtributes.chartDataType;
  //     object.chartName = chartAtributes.chartName;
  //     object.chartType = chartAtributes.chartType;
  //     if (chartAtributes.chartData.X[0].chartColor != undefined) {
  //       object.chartLabelColor = chartAtributes.chartData.X[0].chartColor;
  //     }
  //     object.chartColor = [];
  //     object.chartLabel = [];
  //     object.chartData = [];
  //     object.sequence = chartAtributes.sequenceNumber;
  //     object.property = chartAtributes.property;

  //     let LabelColor = [];

  //     if (chartAtributes.chartDataType == 'summary') {
  //       for (let labels of chartAtributes.chartData.X) {
  //         LabelColor.push(labels.chartColor);
  //       }
  //     } else {
  //       for (let labels of chartAtributes.chartData.Y) {
  //         LabelColor.push(labels.chartColor);
  //       }
  //     }

  //     for (let colors of LabelColor) {
  //       let color = Object();
  //       if (chartAtributes.chartType === 'line') {
  //         color.backgroundColor = "transparent";
  //         color.borderColor = colors;
  //       } else {
  //         color.backgroundColor = colors;
  //         color.borderColor = colors;
  //       }
  //       object.chartColor.push(color);
  //     }// for colors*  

  //     let LabelArray = [];
  //     let DataSetArray = [];
  //     if (chartAtributes.chartDataType == 'summary') {
  //       if (chartAtributes.chartType == 'line') {
  //         let lineChartData = [];
  //         for (let key of chartAtributes.chartData.X) {
  //           for (let labels of data) {
  //             if (labels.headers == key.columnName) {
  //               lineChartData.push(labels.value);
  //               LabelArray.push(key.labelName);
  //               break;
  //             }
  //           }
  //         }// label for line chart....

  //         let datasetObject = Object();
  //         datasetObject.data = lineChartData.map(e => e);
  //         datasetObject.label = 'calculation';
  //         DataSetArray.push(datasetObject);
  //       } else {
  //         for (let key of chartAtributes.chartData.X) {
  //           let datasetObject = Object();
  //           datasetObject.data = [];
  //           for (let labels of data) {
  //             if (labels.headers == key.columnName) {
  //               datasetObject.data.push(labels.value);
  //               datasetObject.label = key.labelName;
  //               LabelArray.push(key.labelName);
  //               break;
  //             }
  //           }
  //           DataSetArray.push(datasetObject);
  //         }
  //       }
  //     } // this for Summary chart

  //     else {
  //       for (let labels of data) {
  //         LabelArray.push(labels.EndTime);
  //       }

  //       object.chartLabel = LabelArray.map(e => e); // for labels
  //       for (let key of chartAtributes.chartData.Y) {
  //         let datasetObject = Object();
  //         datasetObject.data = [];
  //         datasetObject.label = key.labelName;
  //         for (let labels of data) {
  //           for (let properties in labels) {
  //             if (key.columnName === properties) {
  //               let colName = properties;
  //               datasetObject.data.push(labels[colName]);
  //             }
  //           }
  //         }
  //         DataSetArray.push(datasetObject);
  //       }
  //     }

  //     object.chartData = DataSetArray.map(e => e);
  //     object.chartLabel = LabelArray.map(e => e); // for labels

  //     this.lineBarReportData.push(object);
  //     this.lineBarReportData.sort((a, b) => a.sequence - b.sequence);
  //     this.Charts.lineBar = [...this.lineBarReportData];


  //   }
  // }

  // callPieDoughnutChart(chartAtributes, data) {
  //   if ((chartAtributes != null) && (data != null)) {
  //     let object = Object();
  //     object.property = chartAtributes.property;//
  //     object.chartDataType = chartAtributes.chartDataType;//
  //     object.chartName = chartAtributes.chartName;//
  //     object.chartType = chartAtributes.chartType;//
  //     object.sequence = chartAtributes.sequenceNumber;//

  //     object.chartLabelColor = "";
  //     object.chartColor = [];
  //     object.chartLabel = [];
  //     object.chartData = [];

  //     let colors = [];

  //     if (chartAtributes.chartData.Y.length != 0) {
  //       for (let search of chartAtributes.chartData.Y) {
  //         for (let key of data) {
  //           if (key.headers === search.columnName) {
  //             colors.push(search.chartColor);
  //             object.chartLabel.push(search.labelName);
  //             object.chartData.push(parseInt(key.value, 10));
  //             break;
  //           }
  //         }
  //       }
  //     }
  //     object.chartColor.push({ backgroundColor: colors });

  //     if (chartAtributes.chartType === 'pie') {
  //       this.piechartReportData.push(object);
  //       this.piechartReportData.sort((a, b) => a.sequence - b.sequence);
  //       this.Charts.pie = [...this.piechartReportData];
  //     }

  //     if (chartAtributes.chartType === 'doughnut') {
  //       this.doughnutchartReportData.push(object);
  //       this.doughnutchartReportData.sort((a, b) => a.sequence - b.sequence);
  //       this.Charts.doughnut = [...this.doughnutchartReportData];
  //     }
  //   }

  // }

  // callGuageChart(chartAtributes, data) {
  //   if ((chartAtributes != null) && (data != null)) {
  //     let object = Object();
  //     object.property = chartAtributes.property;
  //     object.chartDataType = chartAtributes.chartDataType;
  //     object.chartName = chartAtributes.chartName;
  //     object.chartType = chartAtributes.chartType;
  //     object.sequence = chartAtributes.sequenceNumber;

  //     object.chartLabelColor = "";
  //     object.chartColor = [];
  //     object.chartLabel = [];
  //     object.value;

  //     let colors = [];


  //     if (chartAtributes.chartData.Y.length != 0) {
  //       for (let key of data) {
  //         for (let search of chartAtributes.chartData.Y) {
  //           if (key.headers === search.columnName) {
  //             colors.push(search.chartColor);
  //             object.chartLabel.push(search.labelName);
  //             object.value = key.value;
  //           }
  //         }
  //       }
  //     }

  //     this.guagechartReportData.push(object);
  //     this.guagechartReportData.sort((a, b) => a.sequence - b.sequence);
  //     this.Charts.guage = [...this.guagechartReportData];

  //   }
  // }


  setChartDetails(index, chartType, attribute) {
    switch (chartType) {
      case 'lineBar':
        return this.setChartDetailsForLineBar(index, chartType, attribute);
      case 'guage':
        return this.setChartDetailsForGuage(index, chartType, attribute);
      case 'pie':
      case 'doughnut':
        return this.setChartDetailsForPieDougnut(index, chartType, attribute);
    }
  }

  setChartDetailsForPieDougnut(index, chartType, attribute) {

    if (this.Charts[chartType] !== 0) {
      let ArrayForChart = this.Charts[chartType];
      switch (attribute) {
        case 'datasets':
          return ArrayForChart[index].chartData;
        case 'labels':
          return ArrayForChart[index].chartLabel;
        case 'chartType':
          return ArrayForChart[index].chartType;
        case 'colors':
          return ArrayForChart[index].chartColor;
        case 'legend':
          return ArrayForChart[index].legend;
        case 'options':
          return ArrayForChart[index].property;
      }
    }
  }


  setChartDetailsForLineBar(index, chartType, attribute) {


    if (this.Charts[chartType] !== 0) {
      let ArrayForChart = this.Charts[chartType];

      switch (attribute) {
        case 'datasets':
          return ArrayForChart[index].chartData;
        case 'labels':
          return ArrayForChart[index].chartLabel;
        case 'chartType':
          return ArrayForChart[index].chartType;
        case 'colors':
          return ArrayForChart[index].chartColor;
        case 'legend':
            return ArrayForChart[index].legend;
        case 'options':
          return ArrayForChart[index].property;
      }
    }
  }


  setChartDetailsForGuage(index, chartType, attribute) {

    if (this.Charts[chartType] !== 0) {
      let ArrayForChart = this.Charts[chartType];
      switch (attribute) {
        case 'size':
          return ArrayForChart[index].compareProperty.size;
        case 'type':
          return ArrayForChart[index].compareProperty.type;
        case 'append':
          return ArrayForChart[index].compareProperty.append;
        case 'min':
          return ArrayForChart[index].compareProperty.min;
        case 'max':
          return ArrayForChart[index].compareProperty.max;
        case 'cap':
          return ArrayForChart[index].compareProperty.cap;
        case 'thick':
          return ArrayForChart[index].compareProperty.thick;
      }
    }
  }

  private handleError(err, id = 0) {
    this.loadMonitoring = true;
    this.loadSummary = true;
    this.loadHighlight = true;
    this.showChart = true;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.rs.throwError(err);
  }


}