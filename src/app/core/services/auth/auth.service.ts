import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { shareReplay, map } from "rxjs/operators";
import { RestService } from '../../services/rest.service';
import { environment as env } from "../../../../environments/environment";
import { DATA } from "../../data.enum";
import { StorageServiceService } from "./storage-service.service";


@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private rest: RestService, private storageServiceService: StorageServiceService) { }

  login(username: string, password: string) {
    const body = new HttpParams()
      .set(`username`, username)
      .set(`password`, password);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.post(env.login, body.toString(), { headers }).pipe(
      shareReplay(),
      map((resp: Response) => {
        const status = resp.status || false;
        this.storageServiceService.setStorageItem(DATA.ROLE, resp.role);
        if (status) {
          this.storageServiceService.setStorageItem(DATA.APP_SUBJECT, resp.username);
          this.storageServiceService.setStorageItem(DATA.USERNAME, resp.username);
          this.storageServiceService.setStorageItem(DATA.USERID, resp.user_id);
          this.storageServiceService.setStorageItem(DATA.FIRST, resp.first);
          this.storageServiceService.setStorageItem(DATA.ACCOUNT_EXPIRED, resp.accountExpired);
          this.storageServiceService.setStorageItem(DATA.TIME_TO_EXPIRE, resp.timeToExpire);
          this.storageServiceService.setStorageItem(DATA.PASSWORD_ABOUT_TO_EXPIRE, resp.passwordAboutToExpire);
          this.storageServiceService.setStorageItem(DATA.TOKEN, resp.token);
        }

        return status;
      })
    );
  }

  logout() {

    // const headers = new HttpHeaders().set(DATA.CONTENT_TYPE, 'application/x-www-form-urlencoded')
    //   .set(DATA.APP_SUBJECT, this.storageServiceService.getStorageItem(DATA.APP_SUBJECT)).set(DATA.AUTHORIZATION, DATA.BEARER + this.storageServiceService.getStorageItem(DATA.TOKEN));

    this.http.post(env.logout, {}).subscribe((res) => {
      if (res && res['status'] === true) {
        console.log("@@AuthService started@@")
        this.storageServiceService.clearStorageItems();
        console.log("@@AuthService finished@@")
        this.router.navigate(["/login"]);
      }
    },
      (error) => {
        console.log(error)
      });

  };


  getUserDetails(loggedInUserId) {
    return this.http.get(`${env.api}config/user/${loggedInUserId}`);
  }


}

interface Response {
  timeToExpire: string;
  passwordAboutToExpire: string;
  accountExpired: string;
  status: boolean;
  first: string;
  role: string;
  token?: string;
  message: string;
  username: string;
  user_id: string;
}
