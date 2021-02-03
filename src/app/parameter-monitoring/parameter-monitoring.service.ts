
import { Injectable } from "@angular/core";
import { omit, map as lodashMap, sumBy } from "lodash";
import { map } from 'rxjs/operators';
import { GlobalErrorHandler } from "../core/services/error-handler";
import { RestService } from "../core/services/rest.service";

class chartData {
  data: number[];
  label: string;
} //For Line Chart

@Injectable()
export class ParameterMonitoringService {

  object: chartData[] = []; //object of Line Chart Data
  // object:Array<chartData>=[];
  private nextInterval: any[] = [];
  constructor(private error: GlobalErrorHandler, private rest: RestService) { }

  getParameters(machineId: number) {
    return this.rest.get("config/machineParametersById/filter/" + machineId);
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
              "Start Date-Time": element.StartTime,
              "End Date-Time": element.EndTime,
              ...omit(element, ["StartTime", "EndTime"])
            }
          })
        })
      )

  // map((data: any[]) => {
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
      labels: this.nextInterval,
      options: {
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
                display: true,
                labelString: "Parameters Count (No.)",
                fontColor: '#E74C3C'
              }
            }
          ]
        },
        elements: {
          line: {
            tension: 0,
            fill: false
          }
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
}
