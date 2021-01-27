import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from '../../shared/config';
import { ConfigurationService } from '../../configuration.service';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
 

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['../../configstyle.scss']
})
export class ReportComponent {
  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  dialogRef;
  displayedColumns = [
    'report_name',
    'machine_type',
    'actions'
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

  constructor(private _intl:MatPaginatorIntl,public dialog: MatDialog, private config: ConfigurationService, private router: Router) {
    this.getArray(0,0);
  }

  private getArray(limit,offset) {
    this.subscriber = this.config.getreportDetails(0, 0).subscribe(
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
      });
  }  

  ngAfterViewInit() {
    this._intl.itemsPerPageLabel="Records Per Page"; 
   
 }


  addReport(mode = 'add') {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, {});
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  update(row, mode) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row)
    );
  }
  
  view(row, mode) {
    this._dialog(
      {
        height: `620px`,
        width: `800px`,
        disableClose: true
      },
      mode,
      Object.assign({}, row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(ReportDialogComponent, {
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
      if (typeof data != 'string') {
        this.subscriber = this.config.getreportDetails(0,0).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.getArray(0,0);
            }
            else {
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
      this.iterator();}
    else {
      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
  }


  private handleError(err) {
    this.reset();
    this.errMessage = this.config.getErrorMessage(1);
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

  onNavigate(url: string, report) {
    this.router.navigate([url, {report_name: report.report_name, report_id: report.report_id}]);
  }

}

