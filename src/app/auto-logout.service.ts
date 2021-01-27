import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment as env } from '../environments/environment';
import { DATA } from './core/data.enum';
import { StorageServiceService } from './core/services/auth/storage-service.service';

const MINUTES_UNITL_AUTO_LOGOUT = 15;// in mins
const CHECK_INTERVAL = 150000; // in ms

@Injectable()
export class AutoLogoutService {



  constructor(private router: Router, private http: HttpClient, private storageServiceService: StorageServiceService) {
    this.check();
    this.initListener();
    this.initInterval;
  }

  public getLastAction() {
    return parseInt(this.storageServiceService.getStorage(DATA.LAST_ACTION));
  }

  public setLastAction(lastAction: number) {
    this.storageServiceService.saveStorage(DATA.LAST_ACTION, lastAction.toString());
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval = setInterval(() => {
    this.check();
  }, CHECK_INTERVAL);

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;

    const isTimeout = diff < 0;
    if (isTimeout) {
      console.log("$$AutoLogoutService started$$");
      this.storageServiceService.clearStorage();
      console.log("$$AutoLogoutService finished$$");
      if (this.initInterval) {
        clearInterval(this.initInterval);
      }

      const headers = new HttpHeaders().set(DATA.CONTENT_TYPE, 'application/x-www-form-urlencoded')
        .set(DATA.APP_SUBJECT, this.storageServiceService.getStorage(DATA.APP_SUBJECT)).set(DATA.AUTHORIZATION, DATA.BEARER + this.storageServiceService.getStorage(DATA.TOKEN));

      this.http.post(env.logout, { headers }).subscribe((res) => {
        if (res && res['status'] === true) {
          console.log("&&AutoLogoutService API started&&");
          this.storageServiceService.clearStorage();
          this.router.navigate(["/login"]);
          console.log("&&AutoLogoutService API finished&&");
        }
      });

    }
  }
}
