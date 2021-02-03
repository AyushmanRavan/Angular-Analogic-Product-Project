import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { truncate } from 'lodash';
import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from 'src/app/configuration/shared/config';
import { UserDialogComponent } from 'src/app/configuration/user/dialog/dialog.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { DATA } from '../data.enum';
import { AuthService } from '../services/auth/auth.service';
import { StorageServiceService } from '../services/auth/storage-service.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() toggle = new EventEmitter<boolean>();
  // @Input() menudisplay: boolean;

  isFirstTimeUser: string;
  isAccountExpired: string;
  timeToExpire;
  passwordAboutToExpire;
  convertedTimeToExpired;
  menuBarDisplay: boolean = false;
  datatoggle = true;
  username;
  toggleUser;
  togglePasswordMenu;
  actionMode: string;
  dialogRef;
  changePasswordDialogRef;
  loggedInUserData;
  userFullName;
  errMessage;
  loggedInUserId = this.storageServiceService.getStorageItem(DATA.USERID);
  @ViewChild('passwordMenu') notificationBtn: MatMenuTrigger;
  constructor(private auth: AuthService, private router: Router, private storageServiceService: StorageServiceService, public dialog: MatDialog) {
    this.username = this.storageServiceService.getStorageItem(DATA.USERNAME);
  }

  open() {
    this.toggle.emit(true);
  }

  openOnMouseOver() {
    this.notificationBtn.openMenu();
  }

  ngOnInit(): void {
    this.isFirstTimeUser = this.storageServiceService.getStorageItem(DATA.FIRST);
    this.isAccountExpired = this.storageServiceService.getStorageItem(DATA.IS_ACCOUNT_EXPIRED);
    this.auth.getUserDetails(this.loggedInUserId).subscribe((res) => {
      this.loggedInUserData = res;
      this.userFullName = res['name'];
      if (this.isFirstTimeUser === 'true' || this.isAccountExpired === 'true') {
        this.openChangePassword('edit');
      }
    });
  }

  ngAfterViewInit() {
    this.passwordAboutToExpire = this.storageServiceService.getStorageItem(DATA.PASSWORD_ABOUT_TO_EXPIRE);
    this.timeToExpire = this.storageServiceService.getStorageItem(DATA.TIME_TO_EXPIRE);
    // this.menuBarDisplay = this.menudisplay ? false : true;
    if (this.timeToExpire > 0) {
      this.timeToExpire = Number(this.timeToExpire);
      let seconds = parseInt(this.timeToExpire, 10);
      const days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      const hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      const mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;
      if (days > 0) {
        this.convertedTimeToExpired = days + " days, " + hrs + " Hrs";
      } else {
        this.convertedTimeToExpired = hrs + " Hrs, " + mnts + " Minutes";
      }
    }
    if (this.passwordAboutToExpire === 'true') {
      this.openOnMouseOver();
    }
  }

  onLogout() {
    console.log("log out fired.")
    this.auth.logout();
  }

  togglemenu() {
    this.datatoggle = !this.datatoggle;
  }

  toggleUserDetails() {
    this.toggleUser = !this.toggleUser;
  }

  togglePasswordDetails() {
    this.togglePasswordMenu = !this.togglePasswordMenu;
  }

  loadHomepage() {
    this.router.navigate(['homepage']);
  }



  openChangePassword(mode) {
    this._changePasswordDialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode
    );
  }



  private _changePasswordDialog(options: DIALOG_OPTIONS, mode: string) {
    this.changePasswordDialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      ...options,
      data: {
        btnCaptions: DIALOG_BUTTONS(mode),
        details: this.loggedInUserData
      },
      disableClose: true
    });

    this.changePasswordDialogRef.afterClosed().subscribe((data: any) => {
      if (data && data.updatedPassword) {
        this.isFirstTimeUser = 'false';
        this.storageServiceService.setStorageItem(DATA.FIRST, 'false');
        this.isAccountExpired = 'false';
        this.storageServiceService.setStorageItem(DATA.IS_ACCOUNT_EXPIRED, 'false');
        this.passwordAboutToExpire = 'false';
        this.storageServiceService.setStorageItem(DATA.PASSWORD_ABOUT_TO_EXPIRE, 'false');
      }
    });
  }

  updateUserDetails(mode) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(UserDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: this.loggedInUserData,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode),
        isOpenFromConfig: false
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data !== 'string') {
        this.auth.getUserDetails(this.loggedInUserId).subscribe(
          res => {
            if (this.loggedInUserData['username'] !== res['username']) {
              this.onLogout();
            } else {
              this.loggedInUserData = res;
              this.userFullName = res['name'];
            }
          }
        );
      }
    });
  }





}
