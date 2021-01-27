import { Injectable } from '@angular/core';

import { RestApi } from '../../../core/services/rest.service';

import * as moment from "moment";

@Injectable()
export class MachineReportService {

  constructor(private rest : RestApi) { }


  getMachineInfo(machineName,from,to,interval) {
    return  this.rest.post(`generic/machineInformation`,{"machine_name" : machineName,"start_time" : from,"end_time" : to,"interval" : interval});
    
  }
  getName(machineId:number){
    return this.rest.get(`config/associativename/${machineId}`);

  }

  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss.SSS");
  formatDateOee = dt => moment(dt).format("YYYY-MM-DD 00:00:00.000");

}
