import { Component, OnInit, OnDestroy,HostListener  } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Bar, Xaxis } from "./../../../machine/shared/svg";
import { xAxis as x } from "./../../../machine/shared/svg/data";

import { BarService } from "./../../../machine/shared/svg/bar.service";

import { MachineStatusService } from "./machine-status.service";
import { DATA } from "src/app/core/data.enum";
import { StorageServiceService } from "src/app/core/services/auth/storage-service.service";

@Component({
  selector: 'app-machine-status',
  templateUrl: './machine-status.component.html',
  styleUrls: ['./machine-status.component.scss']
})
export class MachineStatusComponent implements OnInit {

  machineID: number
  loaded: boolean;
  machineName: any;
  machineSummary: MachineSummary;
  xAxis: Xaxis = x.values(screen.width);
  machineData;
  barData: Bar[] | any = [];
  private _barContainerWidth: number = 1012;
  empty: boolean = true;
  errMessage: string;
  Errormsg: boolean;

  constructor(
    private _machine: MachineStatusService,
    private _route: ActivatedRoute, private storageServiceService: StorageServiceService,
    private _bar: BarService) {
  }
  onSelect(e) {
    this.loaded = false;
    this.empty = false;
    this.Errormsg = true;
    this.machineID = e.machineID;

    this._machine.getName(e.machineID).subscribe(
      data => {
        
        this.getProductDetails_MachineStatus(data["associated_name"],e.machineID);
          
      }
    )
    
  }

 

  private getProductDetails_MachineStatus(id: string,pid:number) {

    if (undefined !== id) {
      this._machine.getMachineHealthDetails(id).subscribe(
        data => {
       
          if (data != null) {
          
            for (let i = 0; i < data.length; i++) {
              var To=new Date();
              To.setHours(8,0,0,0);
              const startHour1 = this._bar.getHour(data[i].start_time);
              const startMin = this._bar.getMin(data[i].start_time);
              const startSecond = this._bar.getSeconds(data[i].start_time);
              var startTime = new Date();
              startTime.setHours(startHour1,startMin,startSecond,0);
              const endHour1 = this._bar.getHour(data[i].end_time);
              const endMin = this._bar.getMin(data[i].end_time);
              const endSecond = this._bar.getSeconds(data[i].end_time);
              var endTime = new Date();
              endTime.setHours(endHour1,endMin,endSecond,0);
              if (( +startTime< +To.setHours(8, 0, 0,0)) && (+endTime > +To.setHours(8,0,0,0))) {
               let changeEnd=this._bar.formatDate1(data[i].end_time);
               let end=this._bar.getDate(data[i].end_time);
               data[i].end_time=changeEnd;
               let ob=Object();
               ob.machineName=data[i].machineName
               ob.reason=data[i].reason
               ob.status=data[i].status
               ob.timeslot_id=data[i].timeslot_id 
               ob.start_time= changeEnd;
               ob.end_time=end;
               data.push(ob);
                
              } else {
                if ((+startTime < +To.setHours(16,0,0,0)) && (+endTime > +To.setHours(16,0,0,0))) {
                  let changeEnd=this._bar.formatDate2(data[i].end_time);
                  let end=this._bar.getDate(data[i].end_time);
                  data[i].end_time=changeEnd;
                  let ob=Object();
                  ob.machineName=data[i].machineName
                  ob.reason=data[i].reason
                  ob.status=data[i].status
                  ob.timeslot_id=data[i].timeslot_id 
                  ob.start_time= changeEnd;
                  ob.end_time=end;
                  data.push(ob);
                }
              }
            }
            this.machineData=data;
         
            this.machineName = this.machineData[0].machineName;
            this.barData = this._bar.createBar(
              this.machineData,
              this.barContainerWidth
            );
          }
        },
        err => this.handleError(err)
      );


      this._machine.getMachineHealthSummary(pid).subscribe(
        (data: MachineSummary | any) => {
          this.machineSummary = data;
          this.loaded = true;
        },
        err => this.handleError(err)
      );

    }


  }



  get barContainerWidth() {
    return this._barContainerWidth;
  }

  set barContainerWidth(w: number) {
    this.barContainerWidth = w;
  }

  onResize(width) {
    this.xAxis = x.values(width);
    this.barData = this._bar.createBar(this.machineData, width);
  }

  ngOnInit() {
    this.storageServiceService.setStorageItem(DATA.LAST_ACTION, Date.now().toString());
    this.machineSummary = this._machine.defaultMachineSummary();
  }


  private handleError(err, id = 0) {
    this.reset();
    this.empty = true;
    this.Errormsg = false;
    this.errMessage = this._machine.getErrorMessage(id);
    this._machine.throwError(err);
  }
  private reset() {
    this.loaded = true;
  }

}
interface MachineSummary {
  machineProductionTime: string;
  machineDownTime: string;
  machineIdleTime: string;
  noOfTimeMachineStopages: number;
  reason: string;
}

const MOCK_DATA = [
  {
    start_time: "2018-02-10 12:15:55.0",
    end_time: "2018-02-10 12:25:05.0",
    status: "idle"
  },
  {
    start_time: "2018-02-10 01:41:35.0",
    end_time: "2018-02-10 01:41:45.0",
    status: "on"
  },
  {
    start_time: "2018-02-10 08:00:00.0",
    end_time: "2018-02-10 09:00:00.0",
    status: "on"
  },
  {
    start_time: "2018-02-10 03:43:55.0",
    end_time: "2018-02-10 04:55:05.0",
    status: "off"
  },
  {
    start_time: "2018-02-10 11:55:05.0",
    end_time: "2018-02-10 11:55:45.0",
    status: "on"
  },
  {
    start_time: "2018-02-10 11:55:45.0",
    end_time: "2018-02-10 11:56:05.0",
    status: "off"
  },
  {
    start_time: "2018-02-10 09:00:00.0",
    end_time: "2018-02-10 10:00:00.0",
    status: "on"
  },
  {
    start_time: "2018-02-10 11:56:55.0",
    end_time: "2018-02-10 11:57:15.0",
    status: "off"
  },
  {
    start_time: "2018-02-10 11:57:15.0",
    end_time: "2018-02-10 12:15:55.0",
    status: "on"
  },
  {
    start_time: "2018-02-10 20:57:15.0",
    end_time: "2018-02-10 21:15:55.0",
    status: "on"
  }]


