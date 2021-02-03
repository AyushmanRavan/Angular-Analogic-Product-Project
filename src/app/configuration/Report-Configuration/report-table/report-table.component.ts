import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReportTableDialogComponent } from './report-table-dialog/report-table-dialog.component';
import { ActivatedRoute, Params } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['../../configstyle.scss']
})
export class ReportTableComponent implements OnInit {
  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  data;
  dialogRef;
  displayedColumns = [
    'heading',
    'parameter',
    'unit',
    'sequence_no',
    'calculation',
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
  report: any;
  validToAdd: boolean = false;

  currentPage = 0;
  pageSize = 10;
  array: any;
 
  constructor(private _intl:MatPaginatorIntl,public dialog: MatDialog, private config: ConfigurationService, private router: Router, private route: ActivatedRoute) {
  }

  onNavigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => (this.report = params));
    this.getArray(0,0,this.report.report_id);
  }
  
  private getArray(limit,offset,id) {
    this.subscriber = this.config.getReportTableDetails(0, 0,id).subscribe(
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
 
  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  add(mode, model, data) {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, model, data, '', 0);
  }
 
  update(row, header, mode, model, index) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode, model,
      Object.assign({}, row), header, index
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, model: string, data, header, index) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(ReportTableDialogComponent, {
      ...options,
      data: {
        mode: mode,
        model: model,
        details: data,
        header: header,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode),
        index: index
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data != 'string') {
        this.subscriber = this.config.getReportTableDetails(0,0, this.report.report_id).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.validToAdd = false;
              this.getArray(0,0,this.report.report_id);
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
    this.subscriber = this.config.getReportTableDetails(0, 0,this.report.report_id).subscribe(value => {
      this.datasetLength = value.length;
    }, err => this.handleError(err));

    if (data && data.length > 0) {
      if (data.length >= 2) {
        this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
        this.validToAdd = true;
      } else {
        this.validToAdd = false;
      }  //validation Of Add only two chart
      this.dataSource = data;
    } else {
      this.validToAdd = false;
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
}
