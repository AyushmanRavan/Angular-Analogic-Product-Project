import { Injectable } from '@angular/core';

import { omit, map as lodashMap, sumBy } from "lodash";
import { map } from 'rxjs/operators';

import { GlobalErrorHandler } from "../../../core/services/error-handler";
import { RestService } from "../../../core/services/rest.service";


class chartData {
  data: number[];
  label: string;
} //For Line Chart

@Injectable()
export class MonitoringParamService {

  object: chartData[] = []; //object of Line Chart Data
  // object:Array<chartData>=[];
  private nextInterval: any[] = [];
  constructor(private error: GlobalErrorHandler, private rest: RestService) { }


  getMonitor(machineId: string) {
    return this.rest.get(`generic/MonitoringDashboard/${machineId}`);

  }

  getParameters(machineId: number) {
    return this.rest.get("config/machineParametersById/filter/" + machineId);
  }

  getColumn(machineId: string, dbType: string) {
    return this.rest.get(`generic/genericColumns/${machineId},${dbType}`);

  }
  getName(machineId: number) {
    return this.rest.get(`config/associativename/${machineId}`);

  }

  getChartDataNew(machineName: string) {
    return this.rest.get(`generic/genericChartDataDashboard/${machineName}`);
  }

  getChartLabels(data, value, headerWithColumns) {

    const tempData = [];
    if (value) {
      value.map(row => {
        const d = [];
        let chartLabel;
        headerWithColumns.map((chartHeader) => {
          if (row === chartHeader.value) {
            chartLabel = chartHeader.headers;
          }
        });
        const x1: number[] = []; //this.getEmptyArray(24);
        data.map(c => {
          const start = new Date(c["start_time"]).getHours();
          x1[start] = c[row];
        });
        tempData.push({ data: [...x1], label: chartLabel });
      });
    }

    return tempData;
    // const x1: number[] = this.getEmptyArray(24),
    // x2: number[] = this.getEmptyArray(24);
    //  const x3 : string [] = [];
    //  const x4 : string [] = [];
    //  const x3 : number[] = this.getEmptyArray(24);
    //  const x4 : number[] = this.getEmptyArray(24);
    //this.lineLabel.length = 0;
    // map(data, (item: any) => {
    //   const start = new Date(item["start_time"]).getHours();
    //   const end = new Date(item["end_time"]).getHours();
    //     //x1[start + "-" + end] = item["energy_consumption"];
    //     x1[start] = item["energy_consumption"];
    //     // x3.push(item["total_air_flow"])
    //     // x4.push(item["total_air_compressed"])
    //     x3[start]= item["total_air_flow"];
    //     x4[start] = item["total_air_compressed"]
    //     //this.lineLabel.push(start + "-" + end);

    // });
    // return [
    //   { data: [...x3], label: "Air Volume" }   ,
    //   { data: [...x4], label: "Compressed Volume" }   
    // ];
  }

  getEnergyDetails = (
    machineId,
    input_parameter
  ) =>
    this.rest
      .post(`dynamicReportForDashBoard/report`, {
        machineId,
        input_parameter
      }).pipe(
        map(data => {
          data.map(element => {
            return {
              "Start Date-Time": element.start_time,
              "End Date-Time": element.end_time,
              ...omit(element, ["start_time", "end_time", "logging_time"])
            }
          })
        })
      )

  // .map((data: any[]) => {
  //   let tempData = [];
  //   if (data)
  //     data.forEach(item => {
  //       tempData.push({
  //         "Start Date-Time": item.StartTime,
  //         "End Date-Time": item.EndTime,
  //         ...omit(item, ["StartTime", "EndTime"])
  //       });
  //     });
  //   return tempData;
  // });

  getChartOptions = () => {
    return {
      colors: [
        {
          borderColor: "#0066ff",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "#d9534f",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "green",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "purple",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "blue",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "yellow",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "orange",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "black",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "#ff00f6",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "#55cacc",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "#825d5d",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "#3b6830",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "#8e88cc",
          backgroundColor: 'transparent',
        },
        {
          borderColor: "#6da8bc",
          backgroundColor: 'transparent',
        }
      ],
      labels: this.getHours(24),//this.nextInterval,
      options: {
        bezierCurve: false,
        elements: {
          line: {
            tension: 0
          }
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: "Time",
                fontColor: '#E74C3C'
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: false,
                labelString: "Parameters Count (No.)",
                fontColor: '#E74C3C'
              }
            }
          ]
        }

      }
    };
  };
  getErrorMessage = errorId => this.error.getErrorMessage(errorId);

  throwError = (error: any) => this.error.handleError(error);

  filterMachineDataForComparisionPdf = (machines, omittedColumns) =>
    machines.map(item => omit(item, omittedColumns));

  getTotalConsumed = data => sumBy(data, (item: any) => parseFloat(item.kwh));

  getChartData = (collection = [{}]) => {

    if (this.nextInterval.length != 0) {
      while (this.nextInterval.length > 0) {
        this.nextInterval.pop();
      }
    } //empty before get label

    if (this.object.length != 0) {
      while (this.object.length > 0) {
        this.object.pop();
      }
    } //empty before get param

    lodashMap(collection, (item: any) => {
      this.nextInterval.push(
        new Date(item["End Date-Time"]).getHours() +
        ":" +
        new Date(item["End Date-Time"]).getMinutes() +
        ":" +
        new Date(item["End Date-Time"]).getSeconds()
      );
    }); //for label


    let x: any[] = [];
    let index: number = 0,
      h = 0;

    for (let key in collection[0]) {
      if (key !== "End Date-Time") {
        // (key) Select only parameter
        if (key !== "Start Date-Time") {
          for (let properties of collection) {
            x[h] = properties[key];
            h++;
          }
          this.object.push(new chartData());
          this.object[index].data = Object.assign([], x); //copy to one array to anther
          this.object[index].label = key;
          index++;
          x = [];
          h = 0;
        }
      }
    }


    return this.object;
  };

  private getEmptyArray = n => Array.from(new Array(n), (x, i) => 0);

  private getHours = n => Array.from(new Array(n), (x, i) => i);

}
