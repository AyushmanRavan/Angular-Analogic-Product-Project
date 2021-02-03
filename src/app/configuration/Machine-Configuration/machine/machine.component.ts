import { Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from "../../shared/config";
import { ConfigurationService } from "../../configuration.service";
import { Shift } from "./../../shared/shift";
import { MachineDialogComponent } from "./machine-dialog/machine-dialog.component";
import { AuthService } from "../../../core/services/auth/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { StorageServiceService } from "src/app/core/services/auth/storage-service.service";
import { DATA } from "src/app/core/data.enum";

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['../../configstyle.scss']
})
export class MachineComponent {
  type = 'machine';
  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  dialogRef;
  displayedColumns = ["name", "value", "unit"];
  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;


  currentPage = 0;
  pageSize = 10;
  array: any;


  hideAddMachine: boolean = true;  //Show only for SUPER ADMIN
  role: string;
  datasetLength: number;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private storageServiceService: StorageServiceService, private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ConfigurationService, private user: AuthService) {
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
    this.hideAddMachine = true;
    this.role = this.storageServiceService.getStorageItem(DATA.ROLE);
    if (atob(this.role) == 'SUPERADMIN') {
      this.hideAddMachine = false;
    }
  }


  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Records Per Page";

  }


  addMachine(mode = "add") {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS(460, 600), mode, {});
  }

  update(row, mode) {
    this._dialog(
      mode === MODE.UPDATE
        ? ADD_UPDATE_DIALOG_OPTIONS(455, 600)
        : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(MachineDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode)
      }
    });

    this.dialogRef.afterClosed().subscribe((resp: any) => {
      if (typeof resp != "string") {
        this.subscriber = this.config.getMachineDetails(this.type).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              //  this.getDefaultSet(0,0);
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
    });
  }

  updateDataset(e: any) {

    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
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
      this.dataSource.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
    } else {
      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
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
    this.errMessage = this.config.getErrorMessage(1);
  }

  private reset() {
    this.loaded = true;
  }


}