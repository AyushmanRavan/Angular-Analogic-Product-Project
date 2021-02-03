import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  FormBuilder,  Validators } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';
import { DATA } from 'src/app/core/data.enum';
import { StorageServiceService } from 'src/app/core/services/auth/storage-service.service';

@Component({
  selector: 'app-password-policy-dialog',
  templateUrl: './password-policy-dialog.component.html',
  styleUrls: ['./password-policy-dialog.component.scss']
})
export class PasswordPolicyDialogComponent implements OnInit {
  policyForm;
  loading: boolean;
  passPolicyObj;
  constructor(
    private _dialogRef: MatDialogRef<PasswordPolicyDialogComponent>,
    private _fb: FormBuilder,
    private _user: ConfigurationService,
    private storageServiceService: StorageServiceService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {
    this.policyForm = this._fb.group({
      capital_letters: ['', [Validators.required, Validators.min(0)]],
      numeric_letters: ['', [Validators.required, Validators.min(0)]],
      special_characters: ['', [Validators.required, Validators.min(0)]],
      password_count: ['', [Validators.required, Validators.min(0)]],
      length: ['', [Validators.required, Validators.min(8)]],
      password_policy_id: ['']
    });
  }

  ngOnInit() {
  }
  onSubmit() {
    if (this.policyForm.valid) {
      this.update(this.policyForm.value, this.dialog.mode);
    }
  }

  update(policyForm, mode) {
    this.policyForm.disable();
    this.loading = true;
    let tempData = Object.assign({}, policyForm);
    tempData['update_flag'] = true;
    tempData['set_by'] = this.storageServiceService.getStorageItem(DATA.USERNAME);
    switch (mode) {
      case MODE.ADD:
        this._user.addPasswordPolicy(tempData).subscribe((res) => {
          this._dialogRef.close(res);
        });

        break;

      case MODE.UPDATE:


        break;

      case MODE.DELETE:

        break;
      default:
        return;
    }
  }

}
