import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { HighlightDialogComponent } from './highlight-dialog/highlight-dialog.component';
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
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['../../configstyle.scss']
})
export class HighlightComponent implements OnInit {


  data = new MatTableDataSource<any>();
  isPageLoading: boolean = false;

  actionMode: string;
  noValue: string = "-"
  dataSource = new MatTableDataSource<any>();
  dialogRef;
  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;
  machine = []
  hiddenData: boolean;
  errhidden: boolean;
  displayedColumns = ['heading', 'param_type', 'sequence_no', 'unit', 'calculation', 'actions'];

  datasetLength: number;
  report: any;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  validToAdd: boolean = false;

  currentPage = 0;
  pageSize = 10;
  array: any;

  constructor(private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ConfigurationService, private router: Router, private route: ActivatedRoute) {

  }
  onNavigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => (this.report = params));
    this.getDefaultSet(0, 0, this.report.report_id);
  }
  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Records Per Page";
  }

  getDefaultSet(limit, offset, id) {
    this.subscriber = this.config.getHighlightDetails(0, 0, id).subscribe(data => {
      if (data != null) { this.datasetLength = data.length; }
    }, err => this.handleError(err));

    this.subscriber = this.config.getHighlightDetails(0, 0, id).subscribe(
      data => {
        if (data == null) {
          this.handleErrorOFNoMoreData();
          this.hiddenData = true;
          this.validToAdd = false;
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




  add(mode, model, row, reportId, tableId) {
    //more then 6 parameter can not b added
    if ((model == 'parameter') && (mode == 'add') && (row.parameters != null)) {
      let count = 0;
      row.parameters.forEach(element => {
        count = count + 1;
      });
      if (count == 6) {
        alert("Already 6 Parameter are added");
      } else {
        this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, row, model, reportId, tableId);
      }
    }  // validation for table type if table type is two and if both is use then unable to create table.... 
    else {
      this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, row, model, reportId, tableId);
    }
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data, model, reportId: any, tableId) {

    this.actionMode = mode;
    this.dialogRef = this.dialog.open(HighlightDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode),
        model: model,
        reportId: reportId,
        tableId: tableId
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((resp: any) => {
      if (typeof resp != "string") {
        this.isPageLoading = true;
        this.subscriber = this.config.getHighlightDetails(0, 0, this.report.report_id).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.validToAdd = false;
              this.getDefaultSet(0, 0, this.report.report_id);
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

  // 


  updateDataset(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.data = part;
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
    this.isPageLoading = false;
    this.errMessage = this.config.getErrorMessage(1);
  }


  private reset() {
    this.loaded = true;
  }


  private setTableData(data) {
    this.subscriber = this.config.getHighlightDetails(0, 0, this.report.report_id).subscribe(value => {
      this.datasetLength = value.length;
    }, err => this.handleError(err));


    if (data && data.length > 0) {
      if (data.length >= 1) {
        this.validToAdd = true;
      } else {
        this.validToAdd = false;
      }  //validation Of Add only two chart
      this.data = data;
      this.data.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
      this.isPageLoading = false;
    } else {
      this.validToAdd = false;
      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
  }
}