import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatCheckbox } from "@angular/material/checkbox"
import { FormGroup, FormBuilder, Validator, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';
import { HIDE_ACCESS_DETAILS } from '../../../data';
import { DATA } from 'src/app/core/data.enum';
import { StorageServiceService } from 'src/app/core/services/auth/storage-service.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class UserDialogComponent implements OnInit, AfterViewInit {

  passwordPolicyString;
  hideEnableCheckBox;
  loggedInUserRole;
  disabledRole;
  HIDE_ACCESS_DETAILS = HIDE_ACCESS_DETAILS;
  isPasswordValid = true;
  invalidPasswordMsg;
  passwordObj;
  user: FormGroup;
  loading: boolean;
  roleList;
  roleID: number;
  userId: number = null;
  currentPassword;

  @ViewChild('enabledCheckbox') enabledCheckbox;
  constructor(
    private _dialogRef: MatDialogRef<UserDialogComponent>,
    private _fb: FormBuilder,
    private _user: ConfigurationService, private storageServiceService: StorageServiceService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {
    this.user = this._fb.group({
      user_account_id: '',
      name: ['', [Validators.compose([Validators.required, Validators.pattern("^.*\\S.*[A-Za-z]+$")])]],
      uiRole: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
      passwordExpiry: [''],
      interval: [1, Validators.min(0)],
      lock: [''],
      enabled: [true]
    });
    this._user.getRole().subscribe(roles => {
      this.roleList = roles;
    });
  }

  ngAfterViewInit() {
    if (this.dialog.isOpenFromConfig === true && this.HIDE_ACCESS_DETAILS !== true) {
      this.loggedInUserRole = atob(this.storageServiceService.getStorage(DATA.ROLE));
      if (this.loggedInUserRole !== 'SUPERADMIN') {
        this.enabledCheckbox.nativeElement.style.display = 'none';
      } else {
        this.enabledCheckbox.nativeElement.style.display = 'blocked';
      }
    }

    if (this.dialog.mode === MODE.UPDATE) {
      this.currentPassword = ((this.dialog.details.password !== undefined) ? this.dialog.details.password : '');
      this.user.get('user_account_id').setValue((this.dialog.details.user_account_id !== undefined) ? this.dialog.details.user_account_id : '');
      this.user.get('name').setValue((this.dialog.details.name !== undefined) ? this.dialog.details.name : '');
      this.user.get('uiRole').setValue((this.dialog.details.user_authority.user_authority_id !== undefined) ? this.dialog.details.user_authority.user_authority_id : '');
      this.user.get('username').setValue((this.dialog.details.username !== undefined) ? this.dialog.details.username : '');
      this.user.get('password').setValue((this.dialog.details.password !== undefined) ? this.dialog.details.password : '');
      this.user.get('email').setValue((this.dialog.details.email !== undefined) ? this.dialog.details.email : '');
      this.user.get('mobile').setValue((this.dialog.details.mobile !== undefined) ? this.dialog.details.mobile : '');
      this.user.get('interval').setValue((this.dialog.details.interval !== undefined) ? this.dialog.details.interval : null);
      this.user.get('enabled').setValue((this.dialog.details.enabled !== undefined) ? this.dialog.details.enabled : '');
      if (this.dialog.details.not_expired !== true) {
        this.user.get('passwordExpiry').setValue(true);
      } else {
        this.user.get('passwordExpiry').setValue(false);
      }
      if (this.dialog.details.unLocked !== true) {
        this.user.get('lock').setValue(true);
      } else {
        this.user.get('lock').setValue(false);
      }
      if (this.dialog.details.user_authority && this.dialog.details.user_authority.user_authority_id) {
        this.user.get('uiRole').setValue(this.dialog.details.user_authority.user_authority_id);
      }
      // if (this.dialog.details.user_account_id !== undefined) {
      //   this.userId = this.dialog.details.user_account_id;
      //   this.user.get('password').clearValidators();
      //   this.user.get('password').setValidators([
      //     Validators.required,
      //     // Validators.minLength(8),
      //     // Validators.maxLength(8),
      //     this._user.ValidatePassword(this.dialog.details.user_account_id)]);
      //     this.user.get('password').updateValueAndValidity();
      // }
    }

  }

  ngOnInit() {
    this._user.getPasswordPolicyString().subscribe((res) => {
      if (res && res['policy']) {
        this.passwordPolicyString = res['policy'];
      } else {
        this.passwordPolicyString = '';
      }
    });
    this.disabledRole = (this.dialog && this.dialog.isOpenFromConfig !== true) ? true : false;
    if (this.dialog.isOpenFromConfig !== true && this.HIDE_ACCESS_DETAILS !== true) {
      this.HIDE_ACCESS_DETAILS = true;
    }
  }

  onSubmit() {
    if (this.user.valid) {
      this.update(this.user.value, this.dialog.mode);
    }
  }

  onChange(event, checkBoxName) {
    if (checkBoxName === 'passwordExpiry') {
      this.user.controls['passwordExpiry'].setValue(event.checked);
      if (event.checked === true) {
        this.user.get('interval').setValidators([Validators.required, Validators.min(0)]);
        this.user.get('interval').updateValueAndValidity();
      } else {
        this.user.get('interval').setValue(null);
        this.user.get('interval').clearValidators();
        this.user.get('interval').updateValueAndValidity();
      }
    } else if (checkBoxName === 'lock') {
      this.user.controls['lock'].setValue(event.checked);
    } else if (checkBoxName === 'enabled') {
      this.user.controls['enabled'].setValue(event.checked);
    } else if (checkBoxName === 'interval') {
      if (this.user.get('interval').value === null) {
        this.user.get('interval').setValue(1);
        this.user.get('interval').updateValueAndValidity();
      }
    }
  }

  update(user, mode) {
    let tempData = Object.assign({}, user);
    if (tempData['passwordExpiry'] !== true || tempData['passwordExpiry'] === '') {
      tempData['not_expired'] = true;
      delete tempData['passwordExpiry'];
    } else {
      tempData['not_expired'] = false;
      delete tempData['passwordExpiry'];
    }

    if (tempData['lock'] !== true || tempData['lock'] === '') {
      tempData['unLocked'] = true;
      delete tempData['lock'];
    } else {
      tempData['unLocked'] = false;
      delete tempData['lock'];
    }
    tempData['user_authority'] = {
      'user_authority_id': tempData.uiRole,
      'authority': ''
    };
    tempData['user_account_id'] = tempData.id;
    tempData['actionTakenBy'] = this.storageServiceService.getStorage(DATA.USERNAME);
    tempData['actedUserId'] = Number(this.storageServiceService.getStorage(DATA.USERID));

    let valueofRole = [];
    valueofRole.push(tempData.uiRole);
    tempData.roles = valueofRole;
    delete tempData.uiRole;
    // this.user.disable();

    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        tempData['first'] = true;
        tempData['user_account_id'] = user.user_account_id;
        this.passwordObj = {
          'password': tempData['password'],
          'userId': user.user_account_id
        };
        this._user.validatePassword(this.passwordObj).subscribe(
          response => {
            if (response.valid === true) {
              this._user
                .addUser(tempData)
                .subscribe(
                  newAlarm => { this._dialogRef.close(newAlarm) },
                  err => this.handleError(err)
                );
            } else {
              this.loading = false;
              this.invalidPasswordMsg = response.reason;
              this.user.controls['password'].setErrors({ 'incorrect': true });
            }
          },
          err => {
            alert(JSON.stringify(err));
            this.handleError(err);
          }
        );
        break;

      case MODE.UPDATE:
        tempData['first'] = false;
        tempData['user_account_id'] = user.user_account_id;
        this.passwordObj = {
          'password': tempData['password'],
          'userId': user.user_account_id
        };
        if (this.currentPassword !== tempData['password']) {
          this._user.validatePassword(this.passwordObj).subscribe(
            response => {
              if (response.valid === true) {
                this._user
                  .updateUser(tempData)
                  .subscribe(
                    res => { this._dialogRef.close(res) },
                    err => this.handleError(err)
                  );
              } else {
                this.loading = false;
                this.invalidPasswordMsg = response.reason;
                this.user.controls['password'].setErrors({ 'incorrect': true });
              }
            },
            err => {
              alert(JSON.stringify(err));
              this.handleError(err);
            }
          );
        } else {
          this._user
            .updateUser(tempData)
            .subscribe(
              res => { this._dialogRef.close(res) },
              err => this.handleError(err)
            );
        }
        break;

      case MODE.DELETE:
        const deleteUserObj = {
          'actionTakenBy': this.storageServiceService.getStorage(DATA.USERNAME),
          'actedUserId': Number(this.storageServiceService.getStorage(DATA.USERID)),
          'user_account_id': user.user_account_id
        };
        this._user
          .deleteUser(deleteUserObj)
          .subscribe(
            res => { this._dialogRef.close(user) },
            err => this.handleError(err)
          );
        break;
      default:
        return;
    }
  }

  private handleError(err) {
    this._user.throwError(err);
    this.user.enable();
    this.loading = false;
  }
}

const Role_LIST = [
  'ROLE_USER',
  'ROLE_ADMIN',
  'ROLE_PARTICIPANT'
];


