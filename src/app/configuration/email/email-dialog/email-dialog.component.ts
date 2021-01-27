import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';
import { switchMap } from "rxjs/operators";
import { ViewEncapsulation } from '@angular/core';
import * as moment from "moment";
@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailDialogComponent {
  email: FormGroup;
  loading: boolean;
  userList;
  plantList;
  machineList;
  attachmentList;
  frequency: string[] = ['Hours', 'Daily', 'Weekly', 'Monthly'];
  hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  days: string[] = ['Monday', 'Tusday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  months: any[] = [{ "monthId": 1, "month": "January" }, { "monthId": 2, "month": "February" }, { "monthId": 3, "month": "March" }, { "monthId": 4, "month": "April" }, { "monthId": 5, "month": "May" }, { "monthId": 6, "month": "June" }, { "monthId": 7, "month": "July" }, { "monthId": 8, "month": "August" }, { "monthId": 9, "month": "September" }, { "monthId": 9, "month": "October" }, { "monthId": 11, "month": "November" }, { "monthId": 12, "month": "December" }];
  showhour: boolean = false;
  showDay: boolean = false;
  showStartTime: boolean = false;
  showMonth: boolean = false;
  defaultHours: number;
  defaultFrequency: string;
  defaultDay: string;
  defaultMonth: any;
  editUser: any;
  editPlant: any;
  editMachine: any;
  editFile: any;

  constructor(
    private _dialogRef: MatDialogRef<EmailDialogComponent>,
    private _fb: FormBuilder,
    private _email: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {
    this.email = this._fb.group({
      emailId: '',
      users: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      hour: 0,
      day: '',
      months:null,
      startTime: '',
      plants: ['', [Validators.required]],
      machines: ['', [Validators.required]],
      attachment: ['', [Validators.required]],
      emailDate: ''
    });

    this._email.getUsersDetails().subscribe(users => {
      this.userList = users;
    }, err => this.handleError(err));
    this._email.getPlants(0, 0).subscribe(plant => {
      this.plantList = plant;
    }, err => this.handleError(err));
    this._email.getAttachment().subscribe(data => {
      this.attachmentList = data;
    }, err => this.handleError(err));

    if (dialog.mode === MODE.ADD) {

      //Setting default values
      this.setCurrentTimeToStartTime();
      this.defaultFrequency = 'Hours';
      this.defaultHours = 2;
      this.showhour = true;
      this.showStartTime = true;

    }

    if (dialog.mode === MODE.UPDATE) {

      this._email.getUsersDetails().subscribe(data => {
        this.editUser = this.dialog.details.users;
        this.compareUser(data, this.editUser);
      }, err => this.handleError(err));

      this.email.controls["subject"].setValue(this.dialog.details.subject);
      this.email.controls["body"].setValue(this.dialog.details.body);

      this.onChangeFrequencyUpdate(this.dialog.details.frequency);
      this._email.getPlants(0, 0).subscribe(data => {
        this.editPlant = this.dialog.details.plants;
        this.comparePlant(data, this.editUser);
      }, err => this.handleError(err));

      this._email.getMahines(this.dialog.details.plants.id).subscribe(data => {
        this.machineList = data;
        this.editMachine = this.dialog.details.machines;
        this.compareMachine(data, this.editMachine);
      }, err => this.handleError(err));

      this._email.getAttachment().subscribe(data => {
        this.attachmentList = data;
        this.editFile = this.dialog.details.attachment;
        this.compareFile(data, this.editFile);
      }, err => this.handleError(err));

      this.email.controls["emailId"].setValue(this.dialog.details.emailId);
    }
  }

  onChangeFrequencyUpdate(event) {
    this.defaultFrequency = event;
    if (this.defaultFrequency === 'Hours') {
      this.showhour = true;
      this.defaultHours = this.dialog.details.hour;
      this.showStartTime = true;
      this.email.controls["startTime"].setValue(this.getTime(this.dialog.details.startTime));
    }
    if (this.defaultFrequency === 'Daily') {
      this.showStartTime = true;
      this.email.controls["startTime"].setValue(this.getTime(this.dialog.details.startTime));
    }
    if (this.defaultFrequency === 'Weekly') {
      this.showDay = true; this.showStartTime = true;
      this.defaultDay = this.dialog.details.day;
      this.email.controls["startTime"].setValue(this.getTime(this.dialog.details.startTime));
    }
    if (this.defaultFrequency === 'Monthly') {
      this.setCurrentTimeToStartTime();
      this.showMonth = true;
      this.defaultMonth = this.dialog.details.months;
      this.compareMonth(this.months, this.defaultMonth);

    }
  }
  setCurrentTimeToStartTime(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.email.controls["startTime"].setValue(this.getTime(time));
  }

  onChangeFrequency(event) {
    this.showhour = false;
    this.showDay = false;
    this.showStartTime = false;
    this.showMonth = false;
    
    if (event === 'Hours') { 
       if(this.dialog.details.frequency==='Hours'){this.defaultHours = this.dialog.details.hour;}else{this.defaultHours=1;}
      this.showhour = true;  this.showStartTime = true;
    }
    if (event === 'Weekly') { 
      if(this.dialog.details.frequency==='Weekly'){this.defaultDay = this.dialog.details.day;}else{this.defaultDay='Monday';}
      this.showDay = true; this.showStartTime = true;
    }
    if (event === 'Daily') {
      this.showStartTime = true; 
    }
    if (event === 'Monthly') { 
      if(this.dialog.details.frequency==='Monthly'){  
      this.defaultMonth =this.dialog.details.months; 
      this.compareMonth(this.months, this.defaultMonth);}
      else{
        this.defaultMonth = { "monthId": 1, "month": "January" };
        this.compareMonth(this.months, this.defaultMonth);
      }
      this.showMonth = true; this.showhour = false; this.showDay = false; this.showStartTime = false;
    }
  }

  onChangePlant(event) {
    this._email.getMahines(event.id).subscribe(data => {
      this.machineList = data;
    }, err => this.handleError(err))
  }

  compareUser(param1: any, param2: any) {
    return param1 && param2 ? param1.userId === param2.userId : param1 === param2;
  }
  comparePlant(param1: any, param2: any) {
    return param1 && param2 ? param1.id === param2.id : param1 === param2;
  }
  compareMachine(param1: any, param2: any) {
    return param1 && param2 ? param1.machineId === param2.machineId : param1 === param2;
  }
  compareFile(param1: any, param2: any) {
    return param1 && param2 ? param1.attachmentId === param2.attachmentId : param1 === param2;
  }

  compareMonth(param1: any, param2: any) {
    return param1 && param2 ? param1.monthId === param2.monthId : param1 === param2;
  }


  onSubmit() {
    
    if (this.email.valid) {
      var d = new Date();
      this.email.get('emailDate').setValue(moment(d).format("YYYY-MM-DD HH:mm:ss.SSS"));
      this.email.get('startTime').setValue(moment(this.email.get('startTime').value).format("HH:mm:ss:SSS"));
      this.update(this.email.value, this.dialog.mode);
    }
  }



  update(email, mode) {

    this.email.disable();
    this.loading = false;
    switch (mode) {
      case MODE.ADD:
        this._email
          .addEmail(email)
          .subscribe(
          newAlarm => { this._dialogRef.close(newAlarm) },
          err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this._email
          .updateEmail(email)
          .subscribe(
          res => { this._dialogRef.close(res) },
          err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._email
          .deleteEmail(email.emailId)
          .subscribe(
          res => { this._dialogRef.close(res) },
          err => this.handleError(err)
          );
        break;
      default:
        return;
    }
  }

  private handleError(err) {
    this._email.throwError(err);
    this.email.enable();
    this.loading = false;
  }



  private getTime(time: string, date: boolean = true) {
    const [hh, mm, ss] = time.split(":");
    let t = moment().set({
      hour: parseInt(hh),
      minute: parseInt(mm),
      second: parseInt(ss),
      millisecond: 0
    });
    return date ? t.toDate() : t;
  }


}

