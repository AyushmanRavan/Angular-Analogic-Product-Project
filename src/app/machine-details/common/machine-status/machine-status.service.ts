import { Injectable } from '@angular/core';

import { RestApi } from "../../../core/services/rest.service";
import { GlobalErrorHandler } from "../../../core/services/error-handler";

@Injectable()
export class MachineStatusService {

  constructor(private _rest: RestApi,private error: GlobalErrorHandler) {}
   plantName: string;

  getPlantDetail= (plant: string) => { this.plantName = plant; }
 
  getErrorMessage = errorId => this.error.getErrorMessage(errorId);
  throwError = (error: any) => this.error.handleError(error);

  getMachineHealthDetails = machineId =>
    this._rest.get(`generic/machineInformation/${machineId}`);

  getName(machineId:number){
      return this._rest.get(`config/associativename/${machineId}`);
  
    }

  getMachineHealthSummary = machineId =>
    this._rest.get(`perdayInformation/${machineId}`);

  defaultMachineSummary = () => {
    return {
      machineProductionTime: "0",
      machineDownTime: "0",
      machineIdleTime: "0",
      noOfTimeMachineStopages: 0,
      reason: "N/A"
    };
  };

}
