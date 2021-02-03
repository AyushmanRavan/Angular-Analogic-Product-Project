import { Component,  OnInit } from '@angular/core';
import {  MatDialog,   } from '@angular/material/dialog';

import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
} from '../shared/config';

import { ConfigurationService } from '../configuration.service';
import { PasswordPolicyDialogComponent } from './password-policy-dialog/password-policy-dialog.component'
import { MatPaginatorIntl } from '@angular/material/paginator';
@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html',
  styleUrls: ['../configstyle.scss']
})
export class PasswordPolicyComponent implements OnInit {
  dialogRef;
  actionMode;
  passwordPolicyData;
  loaded = true;
  hiddenData;
  constructor(
    private _intl: MatPaginatorIntl,
    public dialog: MatDialog,
    private config: ConfigurationService
  ) {
    this.getLatestPolicy();
  }

  ngOnInit() {

  }
  
  getLatestPolicy() {
   this.config.getLatestPasswordPolicy().subscribe((res) => {
    // this.hiddenData = true;
    this.passwordPolicyData = res;
    
    });
  }
  addPolicy(mode = 'add') {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, {});
  }
  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(PasswordPolicyDialogComponent, {
      ...options,
      data: {
        mode: mode,
        //   details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        //   title: DIALOG_HEADER(mode),
        //   isOpenFromConfig : true
      },
       disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data != 'string') {
        this.config.getLatestPasswordPolicy().subscribe((res) => {
          // this.hiddenData = true;
          this.passwordPolicyData = res;
          });
      //   this.subscriber = this.config.getUserDetails(0,0).subscribe(
      //     data => {
      //       if (data == null) {
      //         this.paginator.pageIndex=0;
      //         this.getArray(0,0);
      //       } else {
      //         this.setTableData(data);
      //         this.loaded = true;
      //         this.hiddenData = false;
      //         this.errhidden = true;
      //       }
      //     },
      //     err => this.handleError(err)
      //   );
      }
    });
  }
}
