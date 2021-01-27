import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
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
import { ChartDialogComponent } from './chart-dialog/chart-dialog.component';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['../../configstyle.scss']
})
export class ChartComponent implements OnInit {

  actionMode: string;
  dataSource = new MatTableDataSource<any>();

  dialogRef;
  displayedColumns = [
    'labelName',
    'labelParameter',
    'labelType',
    'labelColor',
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

  constructor(private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ConfigurationService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => (this.report = params));
    this.getArray(0, 0, this.report.report_id);
  }

  private getArray(limit, offset, id) {

    this.subscriber = this.config.getCharts(0, 0, id).subscribe(
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


  onNavigate(url: string) {
    this.router.navigate([url]);
  }

  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  add(mode, model, data) {
    this._dialog(model == 'chart' ? ADD_UPDATE_DIALOG_OPTIONS(500, 500) :
      ADD_UPDATE_DIALOG_OPTIONS(500, 600)
      , mode, model, data, '');
  }

  update(row, label, mode, model) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS(500, 600) : mode === MODE.COLORVIEW ? {
        height: `300px`,
        width: `500px`,
        disableClose: true
      } : DELETE_DIALOG_OPTIONS,
      mode, model, Object.assign({}, row), label
    );
  }
 
  private _dialog(options: DIALOG_OPTIONS, mode: string, model: string, data, label) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(ChartDialogComponent, {
      ...options,
      data: {
        mode: mode,
        model: model,
        details: data,
        label: label,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode)
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data != 'string') {
        this.subscriber = this.config.getCharts(0, 0, this.report.report_id).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.getArray(0, 0, this.report.report_id);
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

      if (data.length >= 6) {
        this.validToAdd = true;
      } else {
        this.validToAdd = false;
      }  //validation Of Add only two chart
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
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

