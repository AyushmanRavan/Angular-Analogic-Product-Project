/*import { Injectable } from "@angular/core";
import { filter, sortBy } from "lodash";
import * as moment from "moment";

import { Bar } from "./bar";

@Injectable()
export class BarService {
  
  starthour: any = [];
  endhour: any = [];
  revise_data: any =[];
  start_date:any;
  end_date:any;
  status:any;
  reason:any;
  revise_element:any;
  revise_element1:any;
  constructor() {}

  createBar(data, width, hours = 8) {
    
    return {
      first: this.getBarData(this.getDataShiftWise(data, 0, 8), width, 0),
      second: this.getBarData(this.getDataShiftWise(data, 8, 16), width, 8),
      third: this.getBarData(this.getDataShiftWise(data, 16, 24), width, 16)
    };
  }

  private getBarData(data, width, start) {
    let barData: Bar[] | any = [];
    data.forEach(item => {
      let startTime = moment(item.start_time),
        endTime = moment(item.end_time),
        hrs = Math.abs(startTime.diff(endTime, "seconds")) / 3600,
        diff = moment(item.start_time)
          .subtract(start, "hour")
          .format("HH:mm:ss")
          .split(":"),
        step = width / 8,
        reason = item.status !== "on" ? `Reason: ${item.reason}` : "",
        label = `${item.status.toUpperCase()}: ${startTime.format(
          "HH:mm:ss A"
        )} to ${endTime.format("HH:mm:ss A")} ${reason}`,
        x =
          step * parseInt(diff[0]) +
          step * parseFloat(diff[1]) / 60 +
          step * (parseFloat(diff[2]) / 60) / 60;
      barData.push({
        color: this.getBarColor(item.status),
        label: label,
        value: step * hrs,
        pos: {
          x,
          y: 10
        }
      });
    });
    return barData;
  }

  private getBarColor(type: string) {
    let color = "";
    if (type === "on") color = "#5cb85c";
    if (type === "off") color = "#d9534f";
    if (type === "idle") color = "#f0ad4e";
    return color;
  }

  private getDataShiftWise = (data, from, to = 8) =>
    sortBy(
      filter(data, (item: any) => {
        let h = this.getHour(item.start_time);
        return h >= from && h < to;
      }),
      "start_time"
    );

  private getHour = dt => moment(dt).hour();
}

class MachineStatus{
  start_time:string;
  end_time:string;
  status:string;
  reason:string;
}*/
import { Injectable } from "@angular/core";
import { filter, sortBy } from "lodash";
import * as moment from "moment";

import { Bar } from "./bar";

@Injectable()
export class BarService {
  readonly ON: string = "on";
  constructor() { }

  createBar(data, width, hours = 8) {
   
    var From = new Date();
    var To=new Date();
    return {
      first: this.getBarData(this.getDataShiftWise(data,From.setHours(0, 0, 0,0), To.setHours(8,0,0,0)), width, 0),
      second: this.getBarData(this.getDataShiftWise(data,From.setHours(8, 0, 0,0), To.setHours(16,0,0,0)), width, 8),
      third: this.getBarData(this.getDataShiftWise(data,From.setHours(16, 0, 0,0), To.setHours(24,0,0,0)), width, 16)
    };
  }

  private getBarData(data, width, shift) {
    let barData: Bar[] | any = [];
    if(data.length>0){
      data.forEach(item => {
        const time = {
          startTime: moment(item.start_time),
          endTime: moment(item.end_time),
          startHour: this.getHour(item.start_time),
          endHour: this.getHour(item.end_time)
        };
        const { label, w, x } = this.getBarConfig(item, shift, width, time);
  
        barData.push({
          color: this.getBarColor(item.status),
          label: label,
          value: w,
          pos: {
            x,
            y: 10
          }
        });
      });
    }

    return barData;
  }

  private getBarColor(type: string) {
    let color = "";
    if (type === "on") color = "#5cb85c";
    if (type === "off") color = "#d9534f";
    if (type === "idle") color = "#f0ad4e";
    return color;
  }

  private getDataShiftWise = (data, from, to = 8) =>
    sortBy(filter(data, (item: any) => {
        const startHour1 = this.getHour(item.start_time);
        const startMin = this.getMin(item.start_time);
        const startSecond = this.getSeconds(item.start_time);
        var startTime = new Date();
        startTime.setHours(startHour1,startMin,startSecond,0);
        const endHour1 = this.getHour(item.end_time);
        const endMin = this.getMin(item.end_time);
        const endSecond = this.getSeconds(item.end_time);
        var endTime = new Date();
        endTime.setHours(endHour1,endMin,endSecond,0);
        return ((startTime.getTime() >= from && startTime.getTime() < to) || endTime.getTime() <= to) || (startTime.getTime() < from && endTime.getTime()>=to);
      }),
      "start_time"
    );
  
  public getHour = dt => moment(dt).hour();
  public getMin=dt=>moment(dt).minute();
  public getSeconds=dt=>moment(dt).second();
  public getDate = (dt) => moment(dt).format("YYYY-MM-DD HH:mm:ss");
  public formatDate1 = (dt) => moment(dt).format("YYYY-MM-DD 8:00:00");
  public formatDate2 = (dt) => moment(dt).format("YYYY-MM-DD 16:00:00");
  
  private getTooltip = (status, startTime, endTime, reason) =>
    `${status.toUpperCase()}: ${startTime.format(
      "HH:mm:ss A"
    )} to ${endTime.format("HH:mm:ss A")} ${reason}`;

  private getBarConfig = (
    item: any,
    shift: number,
    width: number,
    { startHour, endHour, startTime, endTime }
  ) => {
    const step = width / 8;
    const reason = item.status !== this.ON ? `Reason: ${item.reason}` : "";
    let hrs = Math.abs(startTime.diff(endTime, "seconds")) / 3600,
      diff = moment(item.start_time)
        .subtract(shift, "hour")
        .format("HH:mm:ss")
        .split(":"),
      label = this.getTooltip(item.status, startTime, endTime, reason),
      x =
        step * parseInt(diff[0]) +
        (step * parseFloat(diff[1])) / 60 +
        (step * (parseFloat(diff[2]) / 60)) / 60;
   

    if (startHour < shift && endHour > shift) {
      diff = moment(item.end_time)
        .subtract(shift, "hour")
        .format("HH:mm:ss")
        .split(":");
      x = 0;

      label = this.getTooltip(
        item.status,
        startTime
          .hour(shift)
          .minute(0)
          .second(0),
        endTime,
        reason
      );

      let tempStartTime = startTime
        .hour(shift)
        .minute(0)
        .second(0);
      hrs = Math.abs(tempStartTime.diff(endTime, "seconds")) / 3600;
    }

    if (endHour > shift + 8) {
      label = this.getTooltip(
        item.status,
        startTime,
        endTime
          .hour(shift + 8)
          .minute(0)
          .second(0),
        reason
      );
    }

    return {
      x,
      label,
      w: step * hrs
    };
  };
}