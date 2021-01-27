import { Component, OnDestroy, ViewChild, OnInit } from "@angular/core";
import { MatPaginator, MatDialog, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { Subscription } from "rxjs/Subscription";

import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from "../shared/config";
import { ConfigurationService } from "../configuration.service";
import { Shift } from "./../shared/shift";
import { ShiftsDialogComponent } from "./shifts-dialog/shifts-dialog.component";

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['../configstyle.scss']
})
export class ShiftsComponent {
  actionMode: string;
  dialogRef;
  displayedColumns = ["breakType", "breakFrom", "breakTo", "actions"];
  errMessage: string;
  loaded: boolean;
  tableData = new MatTableDataSource<any>();
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;
  count: number;

  datasetLength: number;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  currentPage = 0;
  pageSize = 10;
  array: any;
  constructor(private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ConfigurationService) {

    this.getDefaultSet(0, 0);
  }


  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Records Per Page";
    this.tableData.paginator = this.paginator;
  }

  getDefaultSet(limit, offset) {
    this.subscriber = this.config.getShiftDetails(0, 0).subscribe(data => {
      if (data != null) { this.datasetLength = data.length; }
    }, err => this.handleError(err));

    this.subscriber = this.config.getShiftDetails(limit, offset).subscribe(
      data => {
        if (data == null) {
          this.tableData = new MatTableDataSource<any>(data);
          this.handleErrorOFNoMoreData();
          this.hiddenData = true;
        } else {
          this.setTableData(data);
          this.loaded = true;
          this.hiddenData = false;
          this.errhidden = true;
        }
      },
      err => this.handleError(err)
    );
  }

  addShift(mode) {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, this.tableData.data, "shifts", '');
  }

  updateBreaks(item, row, mode, type, allData) {
    let tempData = Object.assign({}, item);
    tempData.breaks = row;
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS
        : ADD_UPDATE_DIALOG_OPTIONS(455, 650),
      mode,
      Object.assign({}, tempData), type, allData
    );
  }

  // updateDataset(event) {
  //   this.subscriber = this.config.getShiftDetails(this.paginator.pageSize, this.paginator.pageIndex + 1).subscribe(
  //     data => {
  //       if (data == null) {
  //         this.tableData=new MatTableDataSource<any>(data);
  //         this.handleErrorOFNoMoreData();
  //         this.hiddenData = true;
  //       }else {
  //         this.setTableData(data);
  //         this.loaded = true;
  //         this.hiddenData = false;
  //         this.errhidden = true;
  //       }
  //     },
  //     err => this.handleError(err)
  //   );

  // }

  updateDataset(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.tableData = new MatTableDataSource<any>(part);

  }
  update(row, mode, type) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS
        : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row), type, this.tableData.data
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data, type: string, allData) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(ShiftsDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode),
        type,
        allData
      }
    });

    this.dialogRef.afterClosed().subscribe((resp: any) => {
      if (typeof resp != "string") {
        this.subscriber = this.config.getShiftDetails(0, 0).subscribe(
          data => {
            if (data == null) {
              this.tableData = new MatTableDataSource<any>(data);
              this.paginator.pageIndex = 0;
              this.getDefaultSet(0, 0);
            } else {
              this.setTableData(data);
              this.loaded = true;
              this.hiddenData = false;
              this.errhidden = true;   /////
            }
          },
          err => this.handleError(err)
        );
      }
    });
  }


  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  private handleError(err) {
    this.reset();
    this.errMessage = this.config.getErrorMessage(0);
    this.config.throwError(err);
  }

  private handleErrorOFNoMoreData() {
    this.reset();
    this.hiddenData = true;//
    this.errhidden = false;//
    this.errMessage = this.config.getErrorMessage(1);
  }

  private reset() {
    this.loaded = true;
  }

  private setTableData(data) {
    this.subscriber = this.config.getShiftDetails(0, 0).subscribe(value => {
      this.datasetLength = value.length;
    }, err => this.handleError(err));
    if (data && data.length > 0) {
      this.tableData = new MatTableDataSource<any>(data);
      this.tableData.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
    } else {

      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
  }
}

