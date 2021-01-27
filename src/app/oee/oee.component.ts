import { AutoLogoutService } from './../auto-logout.service';
import { GlobalErrorHandler } from '../core/services/error-handler';
import { Component, OnInit } from '@angular/core';
import { OeeService } from './oee.service';
import { Oee, OeeGuage, OeeSummary } from './Oee';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DATA } from '../core/data.enum';
import { StorageServiceService } from '../core/services/auth/storage-service.service';
@Component({
  selector: 'app-oee',
  templateUrl: './oee.component.html',
  styleUrls: ['./oee.component.scss']
})
export class OeeComponent implements OnInit {
  oeegauge:any={
    overallpercentage:0,
    productionPercentage:0,
    availablityPercentage:0,
    qualityPercentage:0
  };

  machineID: number;
  loaded: boolean=true;
  spinnerloaded: boolean=true;
  Errormsg: boolean = true;
  machineName: any;
  errMessage: string;
  oeesummary: any;

  //For Guage Chart
  gaugeType = 'semi';
  gaugeAppendText = '%';
  gaugemin = 0;
  gaugemax = 100;
  gaugecap = 'round';
  gaugethick = 15;
  thresholdConfig = {
    '0': { color: 'red' },
    '50': { color: 'orange' },
    '80': { color: 'green' }
  };


  constructor(
    private error: GlobalErrorHandler,
    private logout: AutoLogoutService,
    private route: ActivatedRoute,
    private oee: OeeService,
    private router: Router,
    private storageServiceService: StorageServiceService
    ) { }


  ngOnInit() {
    this.storageServiceService.saveStorage(DATA.LAST_ACTION, Date.now().toString());
    this.route.params.forEach(
      (params: Params) => (this.machineID = params['machineID'])
    );
  }

  scroll(e) {
    e.scrollIntoView();
  }
  onSelect(e) {
    this.loaded = true;
    this.spinnerloaded=true;
    this.Errormsg = true;
    this.machineID = e.machineID;
    this.machineName = e.machineName;
    this.getOEEData(this.machineID);
    this.router.navigate(['dashboard/oee']);
  }

  private getOEEData(id) {
    this.oee.getOeeData(this.machineID).subscribe(data => {
      if (data != null) {
       
        this.oeegauge = data;
        this.oeesummary = data;
        // if (this.oeegauge.overallpercentage >= 100) {
        //   this.oeegauge.overallpercentage = 100;
        // }
        // if (this.oeegauge.productionPercentage >= 100) {
        //   this.oeegauge.productionPercentage = 100;
        // }
        // if (this.oeegauge.availablityPercentage >= 100) {
        //   this.oeegauge.availablityPercentage = 100;
        // }
        // if (this.oeegauge.qualityPercentage >= 100) {
        //   this.oeegauge.qualityPercentage = 100;
        // }
        this.loaded=false;
        this.spinnerloaded=false;
      }else{
        this.spinnerloaded = false;
        this.Errormsg = false;
        this.errMessage = this.error.getErrorMessage(1);
      }
    },err=>this.handleError(err));
  }
  private handleError(err, id = 0) {
    this.loaded=true;
    this.spinnerloaded=false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.oee.throwError(err);
  }

  onNavigate(url: string) {
    this.router.navigate([url, this.machineID]);
  }

}