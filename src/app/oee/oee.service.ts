import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { GlobalErrorHandler } from "../core/services/error-handler";
import { RestApi } from "../core/services/rest.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { groupBy, map, maxBy, minBy, sumBy, orderBy, sortBy } from "lodash";
import { Oee } from './Oee';
import { Overall } from './overall-oee/overall';
import { Productivity } from './productivity/productivity';
import { Availability } from './availability/availability';
import { Quality } from './quality/quality';
@Injectable()
export class OeeService {

  private starttime: any;
  private loggingTime: any[] = [];
  goodpart: number;
  badpart: number;
  goodPercentage: any;
  total: any; badPercentage: any
  constructor(private rest: RestApi, private error: GlobalErrorHandler) { }


  getAvailabilityPieData1 = (id: number) => this.rest.get(`machineStatusInformation/` + id); //done

  getAvailabilityPieData2 = (id: number) => this.rest.get(`planUnplanStatusInformation/` + id);

  getChartDataAvailability = (data) => {
    const onTime = data.onTimeInMinutes,
      OffTime = data.offTimeInMinutes,
      IdleTime = data.idleTimeInMinutes;
    const total = onTime + OffTime + IdleTime;

    const onTimeAngle = Math.trunc((onTime / total) * 360);
    const offTimeAngle = Math.trunc((OffTime / total) * 360);
    const idleTimeAngle = Math.trunc((IdleTime / total) * 360);
    return [
      {
        data: [onTimeAngle, offTimeAngle, idleTimeAngle], label: ["onTime", "offTime", "idleTime"]
      },
    ];
  };

  getChartDataQuality2 = () => {
    const x1 = this.goodpart,
      x2 = this.badpart;
    this.total = x1 + x2;
    this.goodPercentage = (x1 / this.total) * 100;
    this.badPercentage = (x2 / this.total) * 100;
    return [
      { data: [this.goodPercentage, this.badPercentage] },
    ];
  };


  getChartDataPlanUnplan = (data) => {

    const plan = data.planedBreaks,
      unplan = data.unPlanedBreaks;
    const totalplanunplan = plan + unplan;
    const planAngle = Math.round((plan / totalplanunplan) * 360);
    const unplanAngle = Math.round((unplan / totalplanunplan) * 360);
    return [
      {
        data: [planAngle, unplanAngle], label: ["planBreak", "unplanBreak"]
      },
    ];
  };

  //availability service call




  // oee service call end
  getEnergyDetails = (machineID: number, limit: number, offset: number) =>
    this.rest.get(`oeeInformation/${machineID}/?limit=${limit}&offset=${offset}`);

  getEnergyTableColumns = () => [
    "start_time",
    "end_time",
    "overallPercentage",
    "total_production",
    "good_part",
    "availablityPercentage",
    "on_time",
    "qualityPercentage",
  ];

  getChartDataOee = (collection: Overall[]) => {

    const x1: number[] = [], x2: number[] = [], x3: number[] = [], x4: number[] = [],
      x11: any[] = [], x22: any[] = [], temp: any[] = [],
      oeeData: any[] = [], availabilityData: any[] = [], qualityData: any[] = [], productionData: any[] = [],
      oee_Data: any[] = [], availability_Data: any[] = [], quality_Data: any[] = [], production_Data: any[] = [],

      d = new Date(),
      hr = d.getHours(), min = d.getMinutes();
    let j = 0;

    if (this.loggingTime.length != 0) {
      while (this.loggingTime.length > 0) {
        this.loggingTime.pop();
      }
    }

    map(collection, (item: any) => {
      x11.push(new Date(item.end_time).getHours());  //get hrs array
      temp.push(new Date(item.end_time).getHours() + ':' + new Date(item.end_time).getMinutes() + ':' + new Date(item.end_time).getSeconds());
      this.starttime = item.start_time;
      oeeData.push(item.overallpercentage);     //value of overallpercentage in desc order  
      availabilityData.push(item.availablityPercentage);  //value of availablityPercentage in desc order 
      qualityData.push(item.qualityPercentage);     //value of qualityPercentage in desc order  
      productionData.push(item.productionPercentage);  //value of productionPercentage in desc order 
    });

    temp.push(new Date(this.starttime).getHours() + ':' + new Date(this.starttime).getMinutes() + ':' + new Date(this.starttime).getSeconds());   //Pushing start time at zero index
    for (let i = temp.length - 1; i >= 0; i--) {
      this.loggingTime.push(temp[i]);     // Logic For Dynamic Label
    }

    oee_Data.push(0);
    availability_Data.push(0);
    quality_Data.push(0);
    production_Data.push(0);
    for (let i = oeeData.length - 1; i >= 0; i--) {
      oee_Data.push(oeeData[i]);     // Logic For reversing data
      availability_Data.push(availabilityData[i]);     // Logic For reversing  data
      quality_Data.push(qualityData[i]);     // Logic For reversing data
      production_Data.push(productionData[i]);     // Logic For reversing  data
    }

    for (let i = x11.length - 1; i >= 0; i--) {
      x22.push(x11[i]);     // get correct order hrs for compare
    }

    for (let i = x22[0]; i <= hr; j++) {
      i = x22[j];
      x1.push(oee_Data[j]);
      x2.push(availability_Data[j]);
      x3.push(quality_Data[j]);
      x4.push(production_Data[j]);
    }

    return [
      { data: [...x1], label: 'Overall' },
      { data: [...x2], label: 'Availablity' },
      { data: [...x3], label: 'Quality' },
      { data: [...x4], label: 'Production' }
    ];

  };


  getChartOptionsOee = () => {
    return {

      colors: [
        {
          backgroundColor: "transparent",
          borderColor: "#FFCA28",
          pointBackgroundColor: "rgba(148,159,177,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#FFCA28"
        },
        {
          backgroundColor: "transparent",
          borderColor: "#16A085",
          pointBackgroundColor: "rgba(148,159,177,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#16A085"
        },
        {
          backgroundColor: "transparent",
          borderColor: "#2471A3",
          pointBackgroundColor: "rgba(148,159,177,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#2471A3"
        },
        {
          backgroundColor: "transparent",
          borderColor: "#A93226",
          pointBackgroundColor: "rgba(148,159,177,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#A93226"
        }
      ],
      labels: this.loggingTime,
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Time (HH:MM:SS)'
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'OEE'
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

  private getHours = n => Array.from(new Array(n), (x, i) => i);

  private getHour = time => new Date(time).getHours();

  private getEmptyArray = n => Array.from(new Array(n), (x, i) => 0);
  //oee service call end


  // productivity service call 

  getProductivityDetails = (machineID: number, limit: number, offset: number) =>
    this.rest.get(`oeeInformation/${machineID}/?limit=${limit}&offset=${offset}`);

  getChartDataProductivity = (collection: Productivity[]) => {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);

    map(collection, (item: any) => {
      const h = new Date(item.start_time).getHours();
      if (h) {
        x1[h] = item.expectedProduction;
        x2[h] = item.total_production;
      }
    });
    return [
      { data: [...x1], label: "Expected Production" },
      { data: [...x2], label: "Actual Production" }
    ];
  };

  getChartOptionsProductivity = () => {
    return {
      colors: [
        {
          backgroundColor: "#FFEB3B"
        },
        {
          backgroundColor: "#1B5E20"
        }
      ],
      labels: this.getHours(24),
      options: {
        responsive: true,
        scaleShowVerticalLines: false,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Actual & Expected Production (pkts)'
            }
          }],
          xAxes: [{

            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }]
        }
      }
    };
  };

  getTableColumnsProductivity = () => [
    "start_time",
    "end_time",
    "production",
    "expectedProduction",
    "total_production"
  ];

  sortBy = (collection: Productivity[], fields, by = ["desc"]) =>
    orderBy(collection, [...fields], by);
  //poductivity servieccall end

  //quality service call
  getOeeDataQuality = (machineID: number) => this.rest.get(`oeeInformation/${machineID}`)

  getQualityGoodPartTotal = (data: any[]): number => {
    let totalgoodpart: number;
    totalgoodpart = this.getSum(data, "good_part");
    return totalgoodpart
  }

  getQualityBadPartTotal = (data: any[]): number => {
    let totalBadpart: number;
    totalBadpart = this.getSum(data, "bad_part");
    return totalBadpart
  }

  private getSum = (obj, key) => sumBy(obj, key);

  getGoodPartTotal(allData = []): any {
    this.goodpart = this.getQualityGoodPartTotal(allData);
    return this.goodpart;
  }

  getBadPartTotal(allData = []): any {
    this.badpart = this.getQualityBadPartTotal(allData);
    return this.badpart;
  }



  getErrorMessage = errorId => this.error.getErrorMessage(errorId);
  throwError = (error: any) => this.error.handleError(error);

  getChartDataQuality = (collection: Quality[]) => {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);

    map(collection, (item: any) => {
      const h = new Date(item.start_time).getHours();
      if (h) {
        x1[h] = item.good_part;
        x2[h] = item.bad_part;
      }
    });
    return [
      { data: [...x1], label: "Good Part" },
      { data: [...x2], label: "Bad Part" }
    ];
  };

  getChartDataQuality1 = () => {
    const x1 = this.goodpart, x2 = this.badpart;
    return [
      { data: [x1, x2] },
    ];
  };


  getChartOptionsQuality = () => {
    return {
      colors: [
        {
          backgroundColor: "#5cb85c"
        },
        {
          backgroundColor: "#d9534f"
        }
      ],
      labels: this.getHours(24),
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Good & Bad Part (pkts)'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }]
        }
      }
    };
  };

  getQualityDetails = (machineID: number, limit: number, offset: number) =>
    this.rest.get(`oeeInformation/${machineID}/?limit=${limit}&offset=${offset}`);

  sortByQuality = (collection: Quality[], fields, by = ["desc"]) =>
    orderBy(collection, [...fields], by);


  getTableColumnsQuality = () => [
    "start_time",
    "end_time",
    "qualityPercentage",
    "total_production",
    "good_part",
    "bad_part"
  ];

  getOeeData = (id: number) => this.rest.get(`OeepercentageInformation/` + id);

}