import { Injectable } from "@angular/core";
import { groupBy, map, maxBy, omit, sumBy } from "lodash";
import { GlobalErrorHandler } from "../core/services/error-handler";
import { RestApi } from "../core/services/rest.service";

@Injectable()
export class UtilityService {
  constructor(private error: GlobalErrorHandler, private rest: RestApi) {}

  
  throwError = (error: any) => this.error.handleError(error);

  getUtilityDetails = (id: number, limit: number = 0, offset: number = 0) =>
    this.rest
      .get(`utility/information/${id}/?limit=${limit}&offset=${offset}`)
      .map((data: any[]) => {
        let tempData = [];
        if(data!=null)
        {
        data.forEach(item => {
          tempData.push({
            "Start Date-Time": item.StartTime,
            "End Date-Time": item.EndTime,
            ...omit(item, ["StartTime", "EndTime"])
          });
        });
      }
        return tempData;
      });

  getErrorMessage = errorId => this.error.getErrorMessage(errorId);

}
