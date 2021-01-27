import { Injectable } from '@angular/core';

import { RestApi } from '../../../core/services/rest.service';

import { map, orderBy } from "lodash";

@Injectable()


export class AirCompressorService {
  barLabel = [];
  lineLabel = [];
  constructor(private rest : RestApi) { }

  
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
   const x3 : number[] = []; //this.getEmptyArray(24);
   const x4 : number[] = [];//this.getEmptyArray(24);
    this.lineLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          // x3.push(item["total_air_flow"])
          // x4.push(item["total_air_compressed"])
          x3[start]= item["total_air_flow"];
          x4[start] = item["total_air_compressed"]
          //this.lineLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Total Air Flow" }   ,
        { data: [...x4], label: "Compressed Air Volume" }   
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
        }
      ],
      labels: this.getHours(24), //this.lineLabel
      options: {
        bezierCurve : false,
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
              min : 0,
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
  const x3 : number[] = this.getEmptyArray(24);
    this.barLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item["start_time"]).getHours();
        const end = new Date(item["end_time"]).getHours();
          //x1[start + "-" + end] = item["energy_consumption"];
          x1[start] = item["energy_consumption"];
          // x3.push(item["total_energy_consumed"])
          x3[start] = item["total_energy_consumed"];
          this.barLabel.push(start + "-" + end);
        
      });
      return [
        { data: [...x3], label: "Energy Consumption" }   
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
              min : 0,
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
              min : 0,
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


