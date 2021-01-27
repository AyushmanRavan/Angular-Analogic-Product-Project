import { Injectable,Input } from "@angular/core";

import { RestApi } from "../core/services/rest.service";
import { GlobalErrorHandler } from "../core/services/error-handler";

@Injectable()
export class MachineService {
  constructor(private _rest: RestApi,private error: GlobalErrorHandler) {}
   plantName: string;

  getPlantDetail= (plant: string) => { this.plantName = plant; }
 
  getErrorMessage = errorId => this.error.getErrorMessage(errorId);
  throwError = (error: any) => this.error.handleError(error);

  getMachineHealthDetails = machineId =>
    this._rest.get(`machineInformation/${machineId}`);

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
