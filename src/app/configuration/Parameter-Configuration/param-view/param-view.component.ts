import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from "./../../shared/config";

import { MatPaginator,  MatPaginatorIntl } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { ParamViewAddComponent } from "./../../Parameter-Configuration/param-view/param-view-add/param-view-add.component";
import { ConfigurationService } from "./../../../configuration/configuration.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-param-view",
  templateUrl: "./param-view.component.html",
  styleUrls: ["../../configstyle.scss"]
})
export class ParamViewComponent implements OnInit, OnDestroy {

  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  dialogRef;
  displayedColumns = [
    "paramName",
    "paramDataType",
    "defaultValue",
    "length",
    "criticality",
    "countedParam",
    "realParam",
    "actions"
  ];

  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;

  hiddenData: boolean;
  errhidden: boolean;

  datasetLength: number;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  currentPage = 0;
  pageSize = 10;
  array: any;
  constructor(private _intl: MatPaginatorIntl, private config: ConfigurationService, public dialog: MatDialog) {
    this.getDefaultSet(0, 0);
  }

  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Records Per Page";

  }

  getDefaultSet(limit, offset) {
    this.subscriber = this.config.getParameterDetails(0, 0).subscribe(
      data => {
        if (data != null) {
          this.datasetLength = data.length;
        }
      }, err => {
        this.handleError(err);
      });

    this.subscriber = this.config.getParameterDetails(0, 0).subscribe(
      data => {
        if (data == null) {
          this.handleErrorOFNoMoreData();
          this.hiddenData = true;
        } else {
          this.setTableData(data).then(res => {
            this.loaded = true;
          });
          this.hiddenData = false;
          this.errhidden = true;
        }
      },
      err => {
        this.handleError(err);
      });
  }

  addParameter(mode = "add") {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, {});
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  update(row, mode) {
    let { defaultValue, ...tempFields } = row;

    defaultValue =
      row.paramDataType === "datetime"
        ? { defaultValue: new Date(defaultValue) }
        : { length: length, defaultValue: defaultValue };

    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, { ...tempFields, ...defaultValue })
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(ParamViewAddComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode)
      }
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      this.loaded = false;
      if (typeof data != "string") {
        this.subscriber = this.config.getParameterDetails(0, 0).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.getDefaultSet(0, 0);
              this.loaded = true;
            } else {
              this.setTableData(data).then(res => {
                this.loaded = true;
              });
              this.hiddenData = false;
              this.errhidden = true;
            }
          },
          err => this.handleError(err)
        );
      } else {
        this.loaded = true;
      }
    });
  }

  updateDataset(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  private setTableData(data) {

    this.subscriber = this.config.getParameterDetails(0, 0).subscribe(value => {
      this.datasetLength = value.length;
    }, err => this.handleError(err));

    if (data && data.length > 0) {
      this.dataSource = data;
      this.dataSource.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
      return new Promise(resolve => {
        // setTimeout(() => {
        resolve(true);
        // }, 2000);
      });
    } else {
      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
  }

  private handleError(err) {
    this.reset();
    this.errMessage = this.config.getErrorMessage(0);
    this.config.throwError(err);
  }

  private handleErrorOFNoMoreData() {
    this.reset();
    this.hiddenData = true;
    this.errhidden = false;
    this.errMessage = this.config.getErrorMessage(1);
  }

  private reset() {
    this.loaded = true;
  }
}