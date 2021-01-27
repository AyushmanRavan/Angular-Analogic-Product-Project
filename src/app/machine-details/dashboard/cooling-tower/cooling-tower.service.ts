import { Injectable } from '@angular/core';
import { RestApi } from '../../../core/services/rest.service';
import { GlobalErrorHandler } from '../../../core/services/error-handler';

import { map, orderBy } from "lodash";


@Injectable()
export class CoolingTowerService {
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
          x3[start] = item["operating_kcal_hr"];
          x4[start] = item["cooling_capacity"];
          x5[start] = item["flow_rate_water"];
          // x6.push(item["consumed_fuel_2"])
          // x7.push(item["consumed_fuel_3"])
          // x8.push(item["air_flow"])
          // x9.push(item["steam_pressure"])

          this.lineLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Operating Kcal/Hr " }   ,
        { data: [...x4], label: "Cooling Capacity " },
        { data: [...x5], label: "Flow Rate Of Water(GPH) " },
        // { data: [...x6], label: "Fuel Flow 2(TPH) " },
        // { data: [...x7], label: "Fuel Flow 3(TPH) " },
        // { data: [...x8], label: "Air Flow " },
        // { data: [...x9], label: "Steam pressure" },
      ];

  }

  getLineChartDataSecond(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
   //const x3 : string [] = [];
   const x3 : number[] = [];//this.getEmptyArray(24);  
   const x4 : string [] = [];
   const x5 : string [] = [];
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
          x3[start] = item["cooling_tower_efficiency"];
          
          // x6.push(item["consumed_fuel_2"])
          // x7.push(item["consumed_fuel_3"])
          // x8.push(item["air_flow"])
          // x9.push(item["steam_pressure"])

          this.lineLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Cooling Tower Efficiency " }         
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
      labels: this.getHours(24), //this.lineLabel,
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
              beginAtZero: true
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
              beginAtZero: true              
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

  getBarChartData(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
  //  const x3 : string [] = [];
  //  const x4 : string [] = [];
   const x3: number[] = this.getEmptyArray(24);
   const x4: number[] = this.getEmptyArray(24);
    this.barLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          // x3.push(item["fan_energy_consumption"]);
          // x4.push(item["pump_energy_consumption"]);
          x3[start] = item["fan_energy_consumption"];
          x4[start] = item["pump_energy_consumption"];
          this.barLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Fan Energy Consumption " },
        { data: [...x4], label: "Pump Energy Consumption  " }   
      ];

  }
  getBarChartDataForCFC(data){
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
          // x3.push(item["chiller_fan_power"])
          x3[start]  = item["chiller_fan_power"];

          this.barLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Chiller Fan Consumption" }   
      ];

  }

  getBarChartDataForCEC(data){
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
  //  const x3 : string [] = [];
  const x3: number[] = this.getEmptyArray(24);
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
            scaleLabel: {
              display: false,
              labelString: 'Efficiency data',
              fontColor: '#3e6ceb',
              min : 0              
            }

          }],
          xAxes: [{
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
