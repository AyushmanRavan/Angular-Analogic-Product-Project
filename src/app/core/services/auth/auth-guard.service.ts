import { Injectable } from "@angular/core";
import { CanLoad, Route, Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment as env } from '../../../../environments/environment';
import { DATA } from "../../data.enum";
import { StorageServiceService } from "./storage-service.service";
@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private route: Router, private http: HttpClient, private storageServiceService: StorageServiceService) { }

  canLoad(route: Route) {
    if (!this.storageServiceService.getStorage(DATA.TOKEN)) {
      const headers = new HttpHeaders().set(DATA.CONTENT_TYPE, 'application/x-www-form-urlencoded')
        .set(DATA.APP_SUBJECT, this.storageServiceService.getStorage(DATA.APP_SUBJECT)).set(DATA.AUTHORIZATION, DATA.BEARER + this.storageServiceService.getStorage(DATA.TOKEN));

      this.http.post(env.logout, { headers }).subscribe((res) => {
        if (res && res['status'] === true) {
          console.log("##AuthGuard started##")
          this.storageServiceService.clearStorage();
          console.log("##AuthGuard finished##")
          this.route.navigate(["/login"]);
        }
      });
    }
    return true;
  }
}
