import { Injectable } from "@angular/core";
import { CanLoad, Route, Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment as env } from '../../../../environments/environment';
import { DATA } from "../../data.enum";
import { StorageServiceService } from "./storage-service.service";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private route: Router, private storageServiceService: StorageServiceService) { }

  canLoad(route: Route) {
    if (!this.storageServiceService.getStorageItem(DATA.TOKEN)) {

      // const headers = new HttpHeaders().set(DATA.CONTENT_TYPE, 'application/x-www-form-urlencoded')
      //   .set(DATA.APP_SUBJECT, this.storageServiceService.getStorageItem(DATA.APP_SUBJECT)).set(DATA.AUTHORIZATION, DATA.BEARER + this.storageServiceService.getStorageItem(DATA.TOKEN));

      // this.http.post(env.logout, {}).subscribe((res) => {
      //   if (res && res['status'] === true) {
      //     console.log("##AuthGuard started##")
      //     this.storageServiceService.clearStorageItems();
      //     console.log("##AuthGuard finished##")
      //     this.route.navigate(["/login"]);
      //   }
      // });

      this.authService.logout();

    }
    return true;
  }
}
