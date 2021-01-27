import * as moment from "moment";
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';
import { switchMap } from "rxjs/operators";

@Component({
  selector: 'app-sms-dialog',
  templateUrl: './sms-dialog.component.html',
  styleUrls: ['./sms-dialog.component.scss']
})
export class SmsDialogComponent implements OnInit {

  sms: FormGroup;
  loading: boolean;

  Users: any[];
  Plants: any[];
  machines: any[];

  editedUers: any[];
  editedMachine: any[];
  editedPlant: any[];

  smsType = ["productionStatus", "alarm"];
  frequency = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  getType: any;

  constructor(
    private _dialogRef: MatDialogRef<SmsDialogComponent>,
    private _fb: FormBuilder,
    private _sms: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {
    this.sms = this._fb.group({
      smsId: [''],
      users: ['', Validators.required],
      plants: ['', Validators.required],
      smsType: ['', Validators.required],
      machines: ['', Validators.required],
      frequency: [''],
      startTime: ['']
    });

    if (dialog.mode === MODE.ADD) {
      this.sms.get('startTime').disable(),
        this.sms.get('frequency').disable();
    }


    if (dialog.mode === MODE.UPDATE) {


      if (this.dialog.details.smsType == 'alarm')
        this.sms.get('startTime').disable(),
          this.sms.get('frequency').disable()
      else
        this.sms.get('startTime').enable(),
          this.sms.get('frequency').enable();


      this._sms.getAllUsers().subscribe(data => {
        this.editedUers = this.dialog.details.users;
        this.compareUsers(data, this.editedUers)
      }, err => this.handleError(err));


      this._sms.getMahines(this.dialog.details.plants.id).subscribe(data => {
        this.machines = data;
        this.editedMachine = this.dialog.details.machines;
        this.compareMachines(data, this.editedMachine)
      }, err => this.handleError(err));



      this._sms.getPlants(0, 0).subscribe(data => {
        this.Plants = data;
        this.editedPlant = this.dialog.details.plants;
        this.comparePlants(data, this.editedPlant);
      });

      this.sms.controls["smsType"].setValue(this.dialog.details.smsType);
      this.sms.controls["frequency"].setValue(this.dialog.details.frequency);
      let time = this.dialog.details.startTime + ':00:000';  
      if (this.dialog.details.smsType != 'alarm')
        this.sms.controls['startTime'].setValue(this.getTime(time));
      else
        this.sms.controls['startTime'].setValue(' ');
    }

  }

  ngOnInit() {
    this._sms.getAllUsers().subscribe(data => { this.Users = data; }, err => this.handleError(err))
    this._sms.getPlants(0, 0).subscribe(data => { this.Plants = data; }, err => this.handleError(err));
  }

  onSubmit() {
    this.update(this.sms.value, this.dialog.mode);
  }

  update(sms, mode) {

    let tempData = Object.assign({}, sms);
    tempData.startTime = this.formatTimeForSMS(tempData.startTime);

    switch (mode) {
      case MODE.ADD:
        this._sms
          .addSMS(tempData)
          .subscribe(
            newAlarm => { this._dialogRef.close(newAlarm) },
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this._sms
          .updateSMS(tempData)
          .subscribe(
            res => { this._dialogRef.close(res) },
            err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._sms
          .deleteSMS(sms.smsId)
          .subscribe(
            res => { this._dialogRef.close(sms) },
            err => this.handleError(err)
          );
        break;
      default:
        return;
    }
  }

  compareUsers(user1: any, user2: any) { return user1 && user2 ? user1.userId === user2.userId : user1 === user2; }

  compareMachines(machine1: any, machine2: any) { return machine1 && machine2 ? machine1.machineId === machine2.machineId : machine1 === machine2; }

  comparePlants(plant1: any, plant2: any) { return plant1 && plant2 ? plant1.id === plant2.id : plant1 === plant2; }

  onPlantChange(e) {
    this.sms.get('machines').setValue('');
    this._sms.getMahines(e.id).subscribe(data => {
      if (data != null)
        this.machines = data;
    }, err => this.handleError(err))
  }

  onTypeChange(e) {
    this.sms.get('startTime').disable();
    this.getType = e;
    if (this.getType === 'productionStatus') {
      if (this.dialog.details.smsType == 'productionStatus') {
        this.sms.controls["frequency"].setValue(this.dialog.details.frequency);
        let time = this.dialog.details.startTime + ':00:000';
        this.sms.controls['startTime'].setValue(this.getTime(time));
      } else {
        this.sms.controls["frequency"].setValue(1);
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.sms.controls["startTime"].setValue(this.getTime(time));
      }
      this.sms.get('frequency').enable(), this.sms.get('startTime').enable();
    }
    else {
      this.sms.get('frequency').disable(), this.sms.get('startTime').disable();
      this.sms.controls["frequency"].setValue(0);
      this.sms.controls["startTime"].setValue('');
    }
  }





  private handleError(err) {
    this._sms.throwError(err);
    this.sms.enable();
    this.loading = false;
  }

  private formatTimeForSMS = dt => moment(dt).format("HH:mm")

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