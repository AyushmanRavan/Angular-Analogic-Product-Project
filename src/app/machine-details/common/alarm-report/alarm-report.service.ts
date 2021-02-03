import { Injectable } from '@angular/core';

import { RestService } from '../../../core/services/rest.service';

import * as moment from "moment";

@Injectable()
export class AlarmReportService {

  constructor(private rest : RestService) { }

  getAlarmInfo(machineName,from,to,interval) {
    return  this.rest.post(`generic/getAlarms`,{"machine_name" : machineName,"start_time" : from,"end_time" : to,"interval" : interval});
    
  }
  getName(machineId:number){
    return this.rest.get(`config/associativename/${machineId}`);

  }

  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss.SSS");
  formatDateOee = dt => moment(dt).format("YYYY-MM-DD 00:00:00.000");



}
