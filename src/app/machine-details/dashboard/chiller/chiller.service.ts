import { Injectable } from '@angular/core';
import { RestApi } from '../../../core/services/rest.service';
import { GlobalErrorHandler } from '../../../core/services/error-handler';

import { map, orderBy } from "lodash";


@Injectable()
export class ChillerService {
  barLabel = [];
  lineLabel = [];
  constructor(private rest : RestApi) { }

  // getMonitor(machineId:string) {
  //   return  this.rest.get(`utility/utilityMonitoringDashboard/${machineId}`);
    
  // }
  // getColumn(machineId:string) {
  //   return  this.rest.get(`utility/utilityColumns/${machineId}`);
  
  // }
  // getSummary(machineId:string) {
  //   return  this.rest.get(`utility/utilitySummaryDashboard/${machineId}`);
  
  // }
  // getName(machineId:number){
  //   return this.rest.get(`config/associativename/${machineId}`);

  // }
  // getChartData(machineName : string){
  //   return this.rest.get(`utility/utilityChartDataDashboard/${machineName}`)
  // }

  getMonitor(machineId:string) {
    return  this.rest.get(`generic/MonitoringDashboard/${machineId}`);
    
  }
  getColumn(machineId:string) {
    return  this.rest.get(`generic/genericColumns/${machineId},dashboard`);

  }
  getSummary(machineId:string) {
    return  this.rest.get(`generic/analyticalSummary/${machineId}`);

  }
  getName(machineId:number){
    return this.rest.get(`config/associativename/${machineId}`);

  }
  getChartData(machineName : string){
    return this.rest.get(`generic/genericChartDataDashboard/${machineName}`)
  }

  getLineChartData(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
  //  const x3 : string [] = [];
  //  const x4 : string [] = [];
  //  const x5 : string [] = [];

  const x3 : number[] = [];//this.getEmptyArray(24);
  const x4 : number[] = [];//this.getEmptyArray(24);
  const x5 : number[] = [];//this.getEmptyArray(24);
   const x6 : string [] = [];
   const x7 : string [] = [];
   const x8 : string [] = [];
   const x9 : string [] = [];
    this.lineLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          // x3.push(item["net_heat_removed"])
          // x4.push(item["kwh_of_refrigeration"])
          // x5.push(item["flow_rate"])
          x3[start] =item["net_heat_removed"];
          x4[start] = item["kwh_of_refrigeration"];
          x5[start] =item["flow_rate"];
          // x6.push(item["consumed_fuel_2"])
          // x7.push(item["consumed_fuel_3"])
          // x8.push(item["air_flow"])
          // x9.push(item["steam_pressure"])

          this.lineLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Net Heat Removed" }   ,
        { data: [...x4], label: "kWh Of Refrigeration" },
        { data: [...x5], label: "Flow Rate " },
        // { data: [...x6], label: "Fuel Flow 2(TPH) " },
        // { data: [...x7], label: "Fuel Flow 3(TPH) " },
        // { data: [...x8], label: "Air Flow " },
        // { data: [...x9], label: "Steam pressure" },
      ];

  }

  getLineChartDataSecond(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
  //  const x3 : string [] = [];
  //  const x4 : string [] = [];
  //  const x5 : string [] = [];
  const x3 : number[] = [];//this.getEmptyArray(24);
   const x4 : number[] = [];//this.getEmptyArray(24);
   const x5 : number[] = [];//this.getEmptyArray(24);
   const x6 : string [] = [];
   const x7 : string [] = [];
   const x8 : string [] = [];
   const x9 : string [] = [];
    this.lineLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          // x3.push(item["specific_power_consumption"])
          // x4.push(item["eer"])
          // x5.push(item["cop"])
          x3[start] = item["specific_power_consumption"];
          x4[start] = item["eer"];
          x5[start] = item["cop"];
          // x6.push(item["consumed_fuel_2"])
          // x7.push(item["consumed_fuel_3"])
          // x8.push(item["air_flow"])
          // x9.push(item["steam_pressure"])

          this.lineLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Specific Energy Consumption" }   ,
        { data: [...x4], label: "Energy Efficiency Ratio" },
        { data: [...x5], label: "Coefficient Of Performance" },
        // { data: [...x6], label: "Fuel Flow 2(TPH) " },
        // { data: [...x7], label: "Fuel Flow 3(TPH) " },
        // { data: [...x8], label: "Air Flow " },
        // { data: [...x9], label: "Steam pressure" },
      ];

  }

  getLineChartOptions = () => {
    return {
      colors: [
        {
          borderColor: "#0066ff",
          backgroundColor:'transparent',
        },
        {
          borderColor: "#d9534f",
          backgroundColor:'transparent',
        },
        {
          borderColor: "green",
          backgroundColor:'transparent',
        },
        {
          borderColor: "purple",
          backgroundColor:'transparent',
        },
        {
          borderColor: "blue",
          backgroundColor:'transparent',
        },
        {
          borderColor: "yellow",
          backgroundColor:'transparent',
        },
        {
          borderColor: "orange",
          backgroundColor:'transparent',
        }        
      ],
      labels: this.getHours(24),//this.lineLabel,
      options: {
        elements: {
          line: {
              tension: 0
          }
        },
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min : 0
            },
            scaleLabel: {
              display: false,
              labelString: 'Production Data',
              fontColor: '#3e6ceb',
              min : 0              
            }

          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              min : 0
            },
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontColor: '#3e6ceb',
              min : 0
            }
          }]
        }
      
      }
    };
  };

  getBarChartDataForEC(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
   const x3 : string [] = [];
    this.barLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          x3.push(item["energy_consumption"])
          this.barLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Energy Consumed" }   
      ];

  }
  getBarChartDataForCFC(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
   const x3 : string [] = [];
    this.barLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          x3.push(item["chiller_fan_power"])
          this.barLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Chiller fan Consumption" }   
      ];

  }

  getBarChartDataForCEC(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
    const x3: number[] = this.getEmptyArray(24);
  //  const x3 : string [] = [];
    this.barLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          // x3.push(item["compressor_power"])
          x3[start] = item["compressor_power"];
          this.barLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Compressor Energy Consumption" }   
      ];

  }

  getChartOptions = () => {
    return {
      colors: [
        {
          backgroundColor: "#0066ff"
        },
        {
          backgroundColor: "#d9534f"
        }
      ],
      labels: this.getHours(24), //this.barLabel,
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min : 0
            },
            scaleLabel: {
              display: false,
              labelString: 'Energy Consumption',
              fontColor: '#3e6ceb',
              min : 0              
            }

          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              min : 0
            },
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontColor: '#3e6ceb',
              min : 0
            }
          }]
        }
      
      }
    };
  };

  private getEmptyArray = n => Array.from(new Array(n), (x, i) => 0);

  private getHours = n => Array.from(new Array(n), (x, i) => i);

}
