import { Injectable } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { capitalize, find, groupBy, orderBy } from "lodash";

import { GlobalErrorHandler } from "../core/services/error-handler";
import { Alarm } from "./alarm";
import { RestApi } from "../core/services/rest.service";

/**
 * @author Hardik Pithva
 */
@Injectable()
export class AlarmService {
  constructor(private error: GlobalErrorHandler, private rest: RestApi) {}

  getProductAlarmCount = machineName =>
    this.rest.get(`alarmCountInformation/${machineName}`);

  getProductAlarmDetails = machineName =>
    this.rest.get(`alarmInformation/${machineName}`);

  getErrorMessage = errorId => this.error.getErrorMessage(errorId);

  getTableData = (data: Alarm[]) => {
    let groupedObj = groupBy(data, "alarmName");
    let keys = Object.keys(groupedObj);
    let tempData = [];
    keys.forEach((item, i) => {
      let dataSource = this.sortBy(groupedObj[item], "alarmOntime");
      tempData.push({
        open: i === 0,
        type: `${item.toUpperCase()} (${groupedObj[item].length})`,
        data: new MatTableDataSource(dataSource)
      });
    });
    return tempData;
  };

  getChartData = data => {
    let empty: boolean,
      errMessage = "",
      tempChartData = [];
    if (data && data.length > 0) {
      let tempData: Alarm[] = this.sortBy(data, "alarmCount"),
        total = tempData.length;

      for (let i = 0; i < (total > 10 ? 10 : total); i++) {
        let name = tempData[i].alarmName;
        tempChartData.push({
          data: [
            this.groupedAlarm(tempData, {
              alarmName: name
            })
          ],
          label: capitalize(name)
        });
      }
    } else {
      empty = true;
      errMessage = "No data found.";
    }
    return { chart: tempChartData, empty, errMessage };
  };

  getTableColumns = () => ["alarmName", "alarmIntime","alarmOntime"];

  getChartOptions = () => {
    return {
      colors: [
        {
          backgroundColor: "#36B3F2"
        },
        {
          backgroundColor: "#517BED"
        },
        {
          backgroundColor: "#FF5725"
        },
        {
          backgroundColor: "#FF7951"
        },
        {
          backgroundColor: "#FF8BB1"
        },
        {
          backgroundColor: "#FFE391"
        },
        {
          backgroundColor: "#33D2CF"
        },
        {
          backgroundColor: "#F1F2F4"
        },
        {
          backgroundColor: "#36B3F2"
        },
        {
          backgroundColor: "#A6CAD8"
        }
      ],
      options: {
        responsive:true,
        scales: {
          xAxes: [
            {  
              barPercentage: 0.4
            }
          ],
          yAxes: [
            { 
              ticks: {
                min: 0,
                userCallback: (label, index, labels) => {
                  if (Math.floor(label) === label) {
                    return label;
                  }
                }
              }
            }
          ]
        }
      }
    };
  };

  groupedAlarm = (collection, val) => {
    let el: any = find(collection, val);
    return el ? el.alarmCount : 0;
  };

  throwError = (error: any) => this.error.handleError(error);

  private sortBy = (
    collection: Alarm[],
    fields,
    by = ["desc"]
  ): Alarm[] | any[] => orderBy(collection, [...fields], by);
}
