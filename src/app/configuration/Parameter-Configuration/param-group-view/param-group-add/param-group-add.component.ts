
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Subscription } from "rxjs/Subscription";
import { ConfigurationService } from "../../../configuration.service";
import { MODE } from "../../../shared/config";

@Component({
  selector: "app-param-group-add",
  templateUrl: "./param-group-add.component.html",
  styleUrls: ["./param-group-add.component.scss"]
})
export class ParamGroupAddComponent implements OnInit {
  paramgroup: FormGroup;
  importedGroup = [];

  result = [];
  result1: string;
  paramlist1 = [];
  paramlist2 = [];
  value: any;
  name: any;
  flag: number;

  checkedList1 = [];
  checkedList2 = [];
  imported_parameters: any;
  checkboxFlag: boolean = false;
  loading: boolean;
  id: number;

  subscriber: Subscription;
  hiddencol: boolean = false;
  groupid: any[];

  title: string = "Parameter Group";

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private _dialogRef: MatDialogRef<ParamGroupAddComponent>,
    private fb: FormBuilder,
    private _groupadd: ConfigurationService
  ) {
    this.paramgroup = this.fb.group({
      id: "",
      pg_name: ["", [Validators.required]],
      imported_parameters: [""]
    });
    this.subscriber = this._groupadd.getParameterDetails(0, 0).subscribe(data => {
      this.paramlist1 = data;
    });

    if (dialog.mode === MODE.UPDATE) {
      if (dialog.details) {
        if (this.paramlist2 != null) {
          if (this.paramlist2.length != 0) {
            while (this.paramlist2.length > 0) {
              this.paramlist2.pop();
            }
          }
        }
        this.callParamlist1();
        this.groupid = this.dialog.details.id;
        this.subscriber = this._groupadd
          .getParameterGroupWithID(this.groupid)
          .subscribe(data => {
            for (let i = 0; i < data.length; i++) {
              this.paramlist2.push(data[i]);
            }
            for (var i = 0; i < this.paramlist2.length; i++) {
              {
                for (var j = 0; j < this.paramlist1.length; j++) {
                  if (this.paramlist2[i].id == this.paramlist1[j].id) {
                    this.paramlist1.splice(j, 1);
                    break;
                  }
                }
              }
            }
          });
      }
      this.paramgroup.setValue(dialog.details);
    }
  }

  ngOnInit() {
    this._groupadd.getParameterGroup().subscribe(data => {
      this.importedGroup = data;
    });
  }

  onGroupChange(event: number) {
    if (this.paramlist2 != null) {
      if (this.paramlist2.length != 0) {
        while (this.paramlist2.length > 0) {
          this.paramlist2.pop();
        }
      }
    }
    this.callParamlist1();
    this.id = event;
    this.subscriber = this._groupadd
      .getParameterGroupWithID(this.id)
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.paramlist2.push(data[i]);
        }
        for (var i = 0; i < this.paramlist2.length; i++) {
          {
            for (var j = 0; j < this.paramlist1.length; j++) {
              if (this.paramlist2[i].id == this.paramlist1[j].id) {
                this.paramlist1.splice(j, 1);
                break;
              }
            }
          }
        }
      });
  }

  private callParamlist1() {
    if (this.paramlist1 != null) {
      if (this.paramlist1.length != 0) {
        while (this.paramlist1.length > 0) {
          this.paramlist1.pop();
        }
      }
    }
    this.subscriber = this._groupadd.getParameterDetails(0, 0).subscribe(data => {
      this.paramlist1 = data;
    });
  }
  onSubmit() {
    if (this.paramlist2.length != 0) {
      //check Group name unique or not
      for (var a of this.paramlist2) {
        this.result.push(a["id"]);
      }
      this.result1 = JSON.stringify(this.result);
      this.name = this.paramgroup.get("pg_name").value;
      this.update(
        this.paramgroup.value,
        this.name,
        this.result1,
        this.dialog.mode
      );
    }

    else{
      alert("Please Select Parameters");
    }

  }

  update(group, pg_name, imported_parameters, mode) {
    this.paramgroup.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this._groupadd
          .addgropuParameter(pg_name, imported_parameters)
          .subscribe(
          newGroup => this._dialogRef.close(newGroup),
          err => this.handleError(err)
          );

        break;

      case MODE.UPDATE:
        this._groupadd
          .updateGroup(group, pg_name, imported_parameters)
          .subscribe(
          res => this._dialogRef.close(res),
          err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._groupadd
          .deleteGroup(group.id)
          .subscribe(
          res => this._dialogRef.close(group),
          err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  onCheckboxChange1(option, event) {
    if (event.target.checked) {
      this.checkedList1.push(option);
    } else {
      for (var i = 0; i <= this.paramlist1.length; i++) {
        if (this.checkedList1[i] == option) {
          this.checkedList1.splice(i, 1);
        }
      }
    }
  }

  onCheckboxChange2(option, event) {
    if (event.target.checked) {
      this.checkedList2.push(option);
    } else {
      for (var i = 0; i <= this.paramlist2.length; i++) {
        if (this.checkedList2[i] == option) {
          this.checkedList2.splice(i, 1);
        }
      }
    }
  }

  onAddClick() {
    for (var i = 0; i < this.checkedList1.length; i++) {
      for (var j = 0; j < this.paramlist1.length; j++) {
        if (this.checkedList1[i] == this.paramlist1[j]) {
          this.paramlist1.splice(j, 1); //Pull Element
        }
      }
      this.paramlist2.push(this.checkedList1[i]); //Push Element
    }
    for (var i = 0; i <= this.checkedList1.length; i++) {
      this.checkedList1.splice(i, this.checkedList1.length); //empty temp array for next action
    }
    //this array data pass to API when form is submited

    this.checkboxFlag = false;
  }

  onRemoveClick() {
    for (var i = 0; i < this.checkedList2.length; i++) {
      for (var j = 0; j < this.paramlist2.length; j++) {
        if (this.checkedList2[i] == this.paramlist2[j]) {
          this.paramlist2.splice(j, 1); //Pull Element
        }
      }
      this.paramlist1.push(this.checkedList2[i]); //Push Element
    }
    for (var i = 0; i <= this.checkedList2.length; i++) {
      this.checkedList2.splice(i, this.checkedList2.length); //empty temp array for next action
    }

    this.checkboxFlag = false;
  }

  private handleError(err) {
    this._groupadd.throwError(err);
    this.paramgroup.enable();
    this.loading = false;
  }
}


