import { Injectable } from "@angular/core";
import { groupBy, map, maxBy, minBy, sumBy,orderBy ,omit} from "lodash";
import { GlobalErrorHandler } from "../core/services/error-handler";
import { RestApi } from "../core/services/rest.service";
import { Energy } from "./../energy-dashboard/energy-dashboard";
class chartData {
  data: number[];
  label: string;
} //For Line Chart

@Injectable()
export class EnergyDashboardService {
  
  private nextInterval: any[] = [];
  private loggingTime:any[]=[];
  object: chartData[] = []; //object of Line Chart Data
  constructor(private error: GlobalErrorHandler, private rest: RestApi) {}
  
   
  getParameters(machineId: number) {
    return this.rest.get("config/machineParametersById/filter/" + machineId);
  }
  
  getEnergyForTable = (machineId: number) =>
  this.rest.get(`energyInformation/${machineId}`).map((data: any[]) => {
    let tempData = [];
    if (data)
      data.forEach(item => {
        tempData.push({
          "Start Date-Time": item.start_time,
          "End Date-Time": item.end_time,
          ...omit(item, ["start_time","end_time","logging_time"])
        });
      });
    return tempData;
  });

  getEnergyDetailsForChart = (machineId: number) =>
  this.rest.get(`energyInformationChart/${machineId}`);

 
  getChartOptions = () => {
    return {
      colors: [
        {
          backgroundColor:'transparent',
          borderColor: "#FFCA28",
          pointBackgroundColor: "rgba(148,159,177,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#FFCA28"
        },
        {
          backgroundColor:'transparent',
          borderColor: "#0ba80e",
          pointBackgroundColor: "rgba(148,159,177,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#0ba80e"
        }
      ],
      labels: this.loggingTime,
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'kWh'
            },
          
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
            ticks: {
              autoSkip: false,
            }
          }]
        },
        elements:{
          line:{tension:0}
        }
      }
    };
  };
  

  getChartData = (collection: Energy[]) => { 
    const x1: number[]=[],x2: number[] =[], 
          x11: any[] =[],temp:any[]=[],
          kwhData:any[]=[],
          d = new Date(),
          hr = d.getHours(),min=d.getMinutes();
          let j=0; 
    
    if(this.loggingTime.length!=0){
      while(this.loggingTime.length > 0) {
        this.loggingTime.pop();
    }
  }  
  
    temp.push(new Date(collection[0].logging_time).getHours()+':'+new Date(collection[0].logging_time).getMinutes()+':'+new Date(collection[0].logging_time).getSeconds());   //Pushing start time at zero index
    map(collection, (item: any) => {
    x11.push(new Date(item.logging_time).getHours());  //get hrs array
    temp.push(new Date(item.logging_time).getHours()+':'+new Date(item.logging_time).getMinutes()+':'+new Date(item.logging_time).getSeconds());
    kwhData.push(item.kwh);   
  });
  
  for(let i=0;i<=temp.length-1;i++)
  {
    this.loggingTime.push(temp[i]);     // Logic For Dynamic Label
  }
  
  for(let i=0;i<=hr+1;i++){
    x1.push(kwhData[i]);
  }
  
  return [
    { data: [...x1], label: 'Energy Consumed' }, 
  ];
  };

  
  getErrorMessage = errorId => this.error.getErrorMessage(errorId);

  throwError = (error: any) => this.error.handleError(error);

  filterMachineDataForComparisionPdf = (machines, omittedColumns) =>
  machines.map(item => omit(item, omittedColumns)) ;  
  
  getTotalConsumed = data => sumBy(data, (item: any) => parseFloat(item.kwh));

  sortBy = (collection: Energy[], fields, by = ["desc"]) =>
    orderBy(collection, [...fields], by);

}
