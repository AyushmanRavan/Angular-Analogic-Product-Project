import { Pipe, PipeTransform } from "@angular/core";
import { log } from "util";

@Pipe({
  name: "humanize"
})
export class HumanizePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value ? this._getHumanize(value, args) : 0;
  }

  private _getTime = summary => summary.split(":");

  private _getHumanize(time, args?: any) {
    if (args) {
      let t = time.split(":");
      return `${t[0]}:${t[1]}`;
    } else {
      time = this._getTime(time);
      let buff = "";
      if (time[0] > 0) {
        buff = buff.concat(`${parseInt(time[0])}h`);
      }
      if (time[1] > 0) {
        buff = buff.concat(`${parseInt(time[1]) % 60}m`);
      }
      // if (time[2] > 0) {
      //   buff = buff.concat(`${parseInt(time[2]) % 60}s`);
      // }
      return buff == "" ? "0" : buff;
    }
  }
}
