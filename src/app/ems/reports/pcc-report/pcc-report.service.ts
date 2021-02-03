import { Injectable } from '@angular/core';
import { RestService } from '../../../core/services/rest.service';
import { GlobalErrorHandler } from '../../../core/services/error-handler';
import * as moment from 'moment';
import { DATA } from 'src/app/core/data.enum';
import { StorageServiceService } from 'src/app/core/services/auth/storage-service.service';

@Injectable()
export class PccReportService {
  constructor(private rest: RestService, private storageServiceService: StorageServiceService) { }

  formatDate = dt => moment(dt).format('YYYY-MM-DD HH:mm:ss.SSS');
  formatDateOee = dt => moment(dt).format('YYYY-MM-DD 00:00:00.000');

  getName(machineId: number) {
    return this.rest.get(`config/associativename/${machineId}`);
  }

  getColumn(machineId: string) {
    return this.rest.get(`generic/genericColumns/${machineId},all`);
  }

  getMonitor(machineName, from, to, interval) {
    return this.rest.post(`generic/MonitoringDashboard`,
      {
        'machine_name': machineName,
        'start_time': from,
        'end_time': to,
        'interval': interval,
        'actionTakenBy' : this.storageServiceService.getStorageItem(DATA.USERNAME),
        'actedUserId' : this.storageServiceService.getStorageItem(DATA.USERID),
        'reportType' : 'pcc'
      }
    );
  }
  pdfDownloadService() {
    return this.rest.post(`generic/pdfDownloadService`,{
      'actionTakenBy' : this.storageServiceService.getStorageItem(DATA.USERNAME),
      'actedUserId' : this.storageServiceService.getStorageItem(DATA.USERID),
      'reportType' : 'pcc'
    });
  }
  getSummary(machineName, from, to, interval) {
    return this.rest.post(`generic/SummaryDashboard`,
      {
        'machine_name': machineName,
        'start_time': from,
        'end_time': to,
        'interval': interval
      }
    );
  }
  

}
