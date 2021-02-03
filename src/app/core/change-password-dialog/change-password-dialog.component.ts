import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators ,FormGroup} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/configuration/configuration.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  passwordPolicyString;
  loading = false;
  changePasswordForm;
  passwordObj;
  changePasswordObj;
  invalidPasswordMsg;
  constructor(
    private _dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private _user: ConfigurationService,
  ) {
    this.changePasswordForm = this._fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._user.getPasswordPolicyString().subscribe((res) => {
      if (res && res['policy']) {
        this.passwordPolicyString = res['policy'];
      }else{
        this.passwordPolicyString = '';
      }
    });
  }
  onSubmit() {
    this.loading = true;
    this.passwordObj = {
      'password': this.changePasswordForm.value['password'],
      'userId': this.dialog.details.user_account_id
    };
    this.changePasswordObj = {
      'user_account_id': this.dialog.details.user_account_id,
      'name': this.dialog.details.name,
      'username': this.dialog.details.username,
      'password': this.changePasswordForm.value['password'],
      'first': this.dialog.details.first
    };
    if (this.changePasswordForm.valid) {
      this._user.validatePassword(this.passwordObj).subscribe((res) => {
        if (res.valid !== true) {
          this.loading = false;
          this.invalidPasswordMsg = res.reason;
          this.changePasswordForm.controls['password'].setErrors({ 'incorrect': true });
        } else {
          this._user.changePassword(this.changePasswordObj).subscribe((changePassResponse) => {
            if (changePassResponse["updatedPassword"]) {
              this._dialogRef.close(changePassResponse);
            }
          });

        }
      });

    }
  }




}
