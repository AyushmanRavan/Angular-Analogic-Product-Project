import { Injectable } from '@angular/core';
import { RestService } from '../../../core/services/rest.service';
import { map, orderBy } from 'lodash';
import { GlobalErrorHandler } from '../../../core/services/error-handler';

@Injectable()
export class PccService {
  barLabel = [];
  lineLabel = [];
  constructor(private rest: RestService) { }
  getMonitor(machineId: string) {
    return  this.rest.get(`generic/MonitoringDashboard/${machineId}`);
  }
  getColumn(machineId: string) {
    return  this.rest.get(`generic/genericColumns/${machineId},dashboard`);

  }
  getSummary(machineId: string) {
    return  this.rest.get(`generic/analyticalSummary/${machineId}`);

  }
  getName(machineId: number) {
    return this.rest.get(`config/associativename/${machineId}`);

  }
  getChartData(machineName: string) {
    return this.rest.get(`generic/genericChartDataDashboard/${machineName}`);
  }

  getLineChartDataMP(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    const x5: string[] = [];
    const x6: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      // x1[start + '-' + end] = item['energy_consumption'];
      x1[start] = item['energy_consumption'];
      x3.push(item['voltage']);
      x4.push(item['current']);
      x5.push(item['frequency']);
      x6.push(item['meter_running_value']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Vrms', fill: false, tension: 0 },
      { data: [...x4], label: 'Irms' , fill: false, tension: 0},
      { data: [...x5], label: 'Frequency', fill: false, tension: 0 },
      { data: [...x6], label: 'Meter Value', fill: false, tension: 0}
    ];
  }

  getLineChartDataPowerPG1(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    const x5: string[] = [];
    const x6: string[] = [];
    const x7: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      // x1[start + '-' + end] = item['energy_consumption'];
      x1[start] = item['energy_consumption'];
      x3.push(item['apparent_power']);
      x4.push(item['active_power']);
      x5.push(item['reactive_power']);
      x6.push(item['power_factor']);
      x7.push(item['thd']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Apparent Power', fill: false, tension: 0 },
      { data: [...x4], label: 'Active Power' , fill: false, tension: 0},
      { data: [...x5], label: 'Reactive Power', fill: false, tension: 0},
      { data: [...x6], label: 'PF', fill: false , tension: 0},
      { data: [...x7], label: 'THD', fill: false, tension: 0 }
    ];
  }
  getLineChartDataPhaseData(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    const x5: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      // x1[start + '-' + end] = item['energy_consumption'];
      x1[start] = item['energy_consumption'];
      x3.push(item['r_phase_load']);
      x4.push(item['y_phase_load']);
      x5.push(item['b_phase_load']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'R Phase (KVA)', fill: false, tension: 0 },
      { data: [...x4], label: 'Y Phase (KVA)', fill: false, tension: 0 },
      { data: [...x5], label: 'B Phase (KVA)' , fill: false, tension: 0},
    ];
  }
  getLineChartDataDemandAnalysis(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    const x5: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      // x1[start + '-' + end] = item['energy_consumption'];
      x1[start] = item['energy_consumption'];
      x3.push(item['average_demand']);
      x4.push(item['demand']);
      x5.push(item['peak_demand']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Average Demand', fill: false, tension: 0 },
      { data: [...x4], label: 'Demand', fill: false, tension: 0 },
      { data: [...x5], label: 'Peak Demand', fill: false, tension: 0 },

    ];
  }
  getLineChartOptions = () => {
    return {
      colors: [
        {
          borderColor: '#0066ff'
        },
        {
          borderColor: '#d9534f'
        },
        {
          borderColor: 'green'
        },
        {
          borderColor: 'darkorchid'
        },
        {
          borderColor: 'deepskyblue'
        }
      ],
      labels: this.lineLabel, // this.getHours(24),
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '',
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
      },
      optionsDemandAnalysis : {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power (KVA)',
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
      },
      optionsPhasewiseData : {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Load (KVA)',
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
  }

  getBarChartData(data) {
    const x1: number[] = this.getEmptyArray(24),
    x2: number[] = this.getEmptyArray(24);
   const x3: string [] = [];
    this.barLabel.length = 0;
      map(data, (item: any) => {
        const start = new Date(item['start_time']).getHours();
        const end = new Date(item['end_time']).getHours();
          // x1[start + '-' + end] = item['energy_consumption'];
          x1[start] = item['energy_consumption'];
          x3.push(item['total_energy_consumed']);
          this.barLabel.push(start + '-' + end);
      });
      return [
        { data: [...x3], label: 'Energy Consumption' }
      ];

  }

  getChartOptions = () => {
    return {
      colors: [
        {
          backgroundColor: '#0066ff'
        },
        {
          backgroundColor: '#d9534f'
        }
      ],
      labels: this.barLabel, // this.getHours(24),
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy Consumption',
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
       },
    };
  }

  private getEmptyArray = n => Array.from(new Array(n), (x, i) => 0);

  private getHours = n => Array.from(new Array(n), (x, i) => i);
}
