import {
  Component,
  OnInit,
} from '@angular/core';
import { omit } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ReportsService } from "../reports.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-machine-comparison',
  templateUrl: './machine-comparison.component.html',
  styleUrls: ['./machine-comparison.component.scss']
})
export class MachineComparisonComponent implements OnInit {
  spinerLoaded: boolean = false;
  Errormsg: boolean = false;
  loaded: boolean = true;
  errMessage: string;
  listOfPlantAndMachine = [];
  plants: any;
  plantId: number;
  machineCompare: FormGroup;

  firstmachines;
  secondmachines;
  thirdmachines;
  fourthmachines;


  fromStartAt;
  toStartAt;

  max: Date = new Date();
  min: Date = new Date();

  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;

  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  data: MatTableDataSource<any> = new MatTableDataSource<any>();
  invalid: boolean = true;

  textFormobile: string;

  constructor(private fb: FormBuilder, private rs: ReportsService, private snack: MatSnackBar) {
    this.machineCompare = this.fb.group({
      from: [this.rs.getDate(), Validators.required],
      to: ['', Validators.required],
      firstPlantId: ['', Validators.required],
      firstMachineId: ['', Validators.required],
      secondPlantId: ['', Validators.required],
      secondMachineId: ['', Validators.required],
      thirdPlantId: [''],
      thirdMachineId: [''],
      fourthPlantId: [''],
      fourthMachineId: [''],
    });

    this.fromStartAt = this.rs.getDate();
    this.toStartAt = this.rs.getDate(true);

  }

  ngOnInit() {
    this.rs.getPlant().subscribe(data => {
      if (data != null) {
        this.plants = data;
      } else {
        this.snack.open('No plants', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }

  checkSelection() {
    if (this.machineCompare.get('firstPlantId').valid && this.machineCompare.get('firstMachineId').valid
      && this.machineCompare.get('secondPlantId').valid && this.machineCompare.get('secondMachineId').valid)
      this.invalid = false;
  }

  onChangePlant(plantId, index) {
    this.checkSelection();
    let machineArray = [];
    this.plantId = plantId;

    if (this.listOfPlantAndMachine.length != 0) {

      for (let i = 0; i < this.listOfPlantAndMachine.length; i++) {

        if (this.listOfPlantAndMachine[i].plant == plantId) {

          machineArray.push(this.listOfPlantAndMachine[i].machine['id']);
        }
      }

    }
    this.getPlantWiseMachine(index, plantId, machineArray);
  }



  getPlantWiseMachine(index, plantId, machineArray) {

    this.rs.getPlantWiseMachine(plantId, machineArray).subscribe(data => {
      if (data != null) {
        if (index == 1) {
          this.firstmachines = data;
        } if (index == 2) {
          this.secondmachines = data;
        }
        if (index == 3) {
          this.thirdmachines = data;
        } if (index == 4) {
          this.fourthmachines = data;
        }
      } else {
        this.snack.open('No machine', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }

  onChangeMachine(machine, index) {
    this.checkSelection();
    let newlist = {
      index: index,
      plant: this.plantId,
      machine: machine
    },
      flag = 0,
      value = {},
      plant,
      ind;

    // For Restore the item before change 
    if (this.listOfPlantAndMachine.length != 0) {
      for (let i = 0; i < this.listOfPlantAndMachine.length; i++) {
        if (this.listOfPlantAndMachine[i].index == index) {
          value = this.listOfPlantAndMachine[i].machine;
          plant = this.listOfPlantAndMachine[i].plant;
          break;
        }
      }
    }

    for (let i = 0; i < this.listOfPlantAndMachine.length; i++) {
      if (this.listOfPlantAndMachine[i].index != index) {
        if (this.listOfPlantAndMachine[i].plant == plant) {
          ind = this.listOfPlantAndMachine[i].index;
          if (ind == 1) this.firstmachines.push(value);
          if (ind == 2) this.secondmachines.push(value);
          if (ind == 3) this.thirdmachines.push(value);
          if (ind == 4) this.fourthmachines.push(value);
        }
      }
    }
    ////////end///////

    //Stored latest changes one time condition
    if (this.listOfPlantAndMachine.length == 0) {
      this.listOfPlantAndMachine.push(newlist);
    }

    this.listOfPlantAndMachine.map((todo, i) => {      // For change if index is match
      if (todo.index == newlist.index) {
        flag = 1;
        this.listOfPlantAndMachine[i] = newlist;
      }
    });
    if (flag == 0) {
      this.listOfPlantAndMachine.push(newlist);       //if index not match
    }
    ///end/////// 
    this.updateList(machine['id'], index);  //For Update each list
  }

  updateList(id, index) {

    switch (index) {
      case 1:
        if (this.secondmachines != undefined) this.secondmachines = this.secondmachines.filter(function (e) { return e.id !== id; });
        if (this.thirdmachines != undefined) this.thirdmachines = this.thirdmachines.filter(function (e) { return e.id !== id; });
        if (this.fourthmachines != undefined) this.fourthmachines = this.fourthmachines.filter(function (e) { return e.id !== id; });
        break;
      case 2:
        if (this.firstmachines != undefined) this.firstmachines = this.firstmachines.filter(function (e) { return e.id !== id; });
        if (this.thirdmachines != undefined) this.thirdmachines = this.thirdmachines.filter(function (e) { return e.id !== id; });
        if (this.fourthmachines != undefined) this.fourthmachines = this.fourthmachines.filter(function (e) { return e.id !== id; });
        break;
      case 3:
        if (this.firstmachines != undefined) this.firstmachines = this.firstmachines.filter(function (e) { return e.id !== id; });
        if (this.secondmachines != undefined) this.secondmachines = this.secondmachines.filter(function (e) { return e.id !== id; });
        if (this.fourthmachines != undefined) this.fourthmachines = this.fourthmachines.filter(function (e) { return e.id !== id; });
        break;
      case 4:
        if (this.firstmachines != undefined) this.firstmachines = this.firstmachines.filter(function (e) { return e.id !== id; });
        if (this.thirdmachines != undefined) this.thirdmachines = this.thirdmachines.filter(function (e) { return e.id !== id; });
        if (this.secondmachines != undefined) this.secondmachines = this.secondmachines.filter(function (e) { return e.id !== id; });
        break;
    }

  }

  setMinToDate() {
    const { from } = this.machineCompare.value;
    this.min = from;
  }


  onSubmit() {

    this.spinerLoaded = true;
    this.loaded = true;
    this.Errormsg = true;
    this.pdfReady = false;
    this.getmachineCompareDate(this.machineCompare.value);
  }

  getmachineCompareDate(machineCompare) {

    this.reportVal = { ...machineCompare, type: "machineComparisonReport" };
    this.rs.getMachineCompareData(machineCompare).subscribe(
      data => this.setTableData(data),
      err => this.handleError(err));

  }

  setTableData(data) {

    let tempData = [];
    if (data != null) {
      data.forEach(item => {
        tempData.push({
          Parameter: item.Parameter,
          ...omit(item, ["Parameter"])
        });
      });
      this.data = new MatTableDataSource<any>(tempData);
      this.displayedColumns = [];
      this.columnsToDisplay = [];

      for (let key in tempData[0]) {
        this.displayedColumns.push(key);
        this.columnsToDisplay.push(key);
      }

      this.textFormobile = '1)' + this.displayedColumns[1] + '  2)' + this.displayedColumns[2];
      this.pdfData = tempData;
      this.pdfReady = true;
      this.loaded = false;
      this.spinerLoaded = false;
      this.Errormsg = true;
    }
    else {
      this.loaded = true;
      this.spinerLoaded = false;
      this.Errormsg = false;
      this.errMessage = this.rs.getErrorMessage(1);
    }
  }

  private getDateTime = date => moment(date).format("YYYY-MM-DD HH:mm:ss");

  private handleError(err, id = 0) {
    this.errMessage = this.rs.getErrorMessage(id);
    this.rs.throwError(err);
  }

}