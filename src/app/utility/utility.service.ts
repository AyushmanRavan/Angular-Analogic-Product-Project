import { Injectable } from "@angular/core";
import { omit } from "lodash";
import { map } from "rxjs/operators";
import { GlobalErrorHandler } from "../core/services/error-handler";
import { RestService } from "../core/services/rest.service";

@Injectable()
export class UtilityService {
  constructor(private error: GlobalErrorHandler, private rest: RestService) { }


  throwError = (error: any) => this.error.handleError(error);

  getUtilityDetails = (id: number, limit: number = 0, offset: number = 0) =>
    this.rest
      .get(`utility/information/${id}/?limit=${limit}&offset=${offset}`).pipe(
        map(data => {
          return data.map(element => {
            return { "Start Date-Time": element.StartTime, "End Date-Time": element.EndTime, ...omit(element, ["StartTime", "EndTime"]) };
          });
        })
      );

  // new to of code generation.
  // .map((data: any[]) => {
  //   let tempData = [];
  //   if (data != null) {
  //     data.forEach(item => {
  //       tempData.push({
  //         "Start Date-Time": item.StartTime,
  //         "End Date-Time": item.EndTime,
  //         ...omit(item, ["StartTime", "EndTime"])
  //       });
  //     });
  //   }
  //   return tempData;
  // });

  getErrorMessage = errorId => this.error.getErrorMessage(errorId);

}
