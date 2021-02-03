import { Component,  ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from '../../shared/config';
import { ConfigurationService } from '../../configuration.service';
import { DeptDialogComponent } from '../department/dept-dialog/dept-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['../../configstyle.scss']
})
export class DepartmentComponent {
  type = 'department';
  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  dialogRef;
  displayedColumns = ["name","value","unit"];
 // displayedColumns = ["plantName", "deptName", "actions"];
  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;

  hiddenData: boolean;
  errhidden: boolean;

  datasetLength: number = 0;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;


  currentPage = 0;
  pageSize = 10;
  array: any;

  constructor(private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ConfigurationService) {
    this.getDefaultSet(0, 0);
  }
  getDefaultSet(limit, offset) {

    this.subscriber = this.config.getMachineDetails(this.type).subscribe(
      data => {
        if (data == null) {
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


  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Records Per Page";
  }



  addDepartment(mode = 'add') {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, {});
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  // update({ id, deptName, ...rest }, mode) {

  //   this._dialog(
  //     mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
  //     mode,
  //     Object.assign({}, { id, deptName, plantId: rest.plants.id })
  //   );
  // }
  update(row, mode) {
    this._dialog(
      mode === MODE.UPDATE
        ? ADD_UPDATE_DIALOG_OPTIONS(455, 600)
        : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({},row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(DeptDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode)
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data !== 'string') {
        this.subscriber = this.config.getMachineDetails(this.type).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              //  this.getDefaultSet(0,0);
            }else {
              this.setTableData(data);
              this.loaded = true;
              this.hiddenData = false;
              this.errhidden = true;
            }
          },
          err => this.handleError(err)
        );
      }
    });
  }


  updateDataset(event) {
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
    if (data && data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.array = data;
      this.datasetLength = this.array.length;
      this.dataSource.paginator = this.paginator;
      this.iterator();
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
