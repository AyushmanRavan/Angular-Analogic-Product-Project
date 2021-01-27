import { Injectable } from '@angular/core';
import { compact, find, map } from 'lodash';

import { RestApi } from '../../core/services/rest.service';
import { GlobalErrorHandler } from '../../core/services/error-handler';

const ENERGY = 'energy';
interface Machine {
  machineName: string;
  type: string;
  id: number;
}
interface Plant {
  plant: string;
}

@Injectable()
export class SelectionService {
  constructor(private rest: RestApi, private error: GlobalErrorHandler) { }

  getSummary(machineId: number) {
    return this.rest.get(`dashboardInformation/${machineId}`);
  }

  isSpecialMachine = (name: string, machines: Machine[]) => {
    let special: boolean;
    if (machines) { special = find(machines, ['machineName', name]).type === ENERGY; }
    return special;
  };

  // getMachines = page =>
  //   this.rest.get('machineName').map(machines => {
  //     return { machineInfo: machines, machines: this.exclude(machines, page) };
  //   });

  getPageType = (t) => this.rest.get('generic/getParameterPages/ums,product,ums')

  getdafaultfilter = (type) => this.rest.get(`filter/defaultMachine/${type}`);

  getPlant = () => this.rest.get('config/plants');

  getDept = (id) => this.rest.get(`config/department/filter/${id}`);

  getAssembly = (id) => this.rest.get(`config/assembly/filter/${id}`);

  getMachineNames(plant, department, assembly, reportType) {
    return this.rest.post('config/machine/filter', { plant, department, assembly, reportType })
  }
  getErrorMessage = errorId => this.error.getErrorMessage(errorId);

  throwError = (error: any) => this.error.handleError(error);


  exclude = (machines, filter?) =>
    compact(
      filter
        ? map(machines, 'machineName')
        : map(machines, (item: any) => {
          if (item.type !== 'energy') { return item.machineName; }
        })
    );

  filter = (val: string, options: string[]): string[] =>
    options.filter(
      option => option && option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
}
