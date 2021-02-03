import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DATA } from './core/data.enum';
import { StorageServiceService } from './core/services/auth/storage-service.service';
import { AuthService } from './core/services/auth/auth.service';

const MINUTES_UNITL_AUTO_LOGOUT = 2;// in mins
const CHECK_INTERVAL = 150000; // in ms

@Injectable()
export class AutoLogoutService {

  constructor(private authService: AuthService, private router: Router, private storageServiceService: StorageServiceService) {
    this.check();
    this.initListener();
    this.initInterval;
  }

  public getLastAction() {
    return parseInt(this.storageServiceService.getStorageItem(DATA.LAST_ACTION));
  }

  public setLastAction(lastAction: number) {
    this.storageServiceService.setStorageItem(DATA.LAST_ACTION, lastAction.toString());
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

      console.log("**************************************")
      this.authService.logout();

      if (this.initInterval) {
        clearInterval(this.initInterval);
      }

    }
  }
}
