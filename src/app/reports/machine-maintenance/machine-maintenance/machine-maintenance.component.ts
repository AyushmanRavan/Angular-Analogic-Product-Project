import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from '../../../configuration/shared/config';
import { ReportsService } from "../../reports.service";
import { MachineMaintenanceDialogComponent } from './machine-maintenance-dialog/machine-maintenance-dialog.component';
import { GlobalErrorHandler } from "../../../core/services/error-handler";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-machine-maintenance',
  templateUrl: './machine-maintenance.component.html',
  styleUrls: ['../machine-maintenance.scss']
})
export class MachineMaintenanceComponent {

  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;
  pdfDataSource: any[] = [];
  ChartArray: any[] = [];
  actionMode: string;
  dialogRef;
  displayedColumns = [
    'machine',
    'maintenance_date',
    'maintenance_hours',
    'remaining_hours',
    'progress',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;
  datasetLength: number;
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  plantOptions = [];
  report: FormGroup;
  plantId:number;

  constructor(private fb: FormBuilder, private error: GlobalErrorHandler, private router: Router, private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ReportsService) {
    this.report = this.fb.group({
      plant: ["", Validators.required]
    });
    this.config
      .getPlant()
      .subscribe(
        data => {
          if (data != null) {
            this.plantOptions = data
          } else {
            this.plantOptions = null;
            this.report.get('plant').setValue('');
          }
        },
        err => this.handleError(err)
      );
  }
  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Record per Page";
    this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  onGenerate(e) {
    this.plantId=e.plant.id;
    this.reportVal = { ...e.plant, type: "maintenance" };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.getDefaultSet(this.plantId);
  }

  getDefaultSet(plantId) {
    this.subscriber = this.config.getMaintenanceDetails(plantId).subscribe(data => { this.pdfReady = false; this.setData(data) }, err => this.handleError(err));
  }

  update(row, mode) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : ADD_UPDATE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(MachineMaintenanceDialogComponent, {
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
        this.subscriber = this.config.getMaintenanceDetails(this.plantId).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.pdfReady = false;
              this.getDefaultSet(this.plantId);
            }
            else {
              this.pdfReady = false;
              this.setData(data);
            }
          },
          err => this.handleError(err)
        );
      }
    });
  }

  private setData(data) {
    if (data != null) {
      let temp = this.config.dataWithProgressCaluculation(data);
      this.dataSource = new MatTableDataSource<Maintenance>(temp);
      this.dataSource.paginator = this.paginator;
      // for PDF
      let cols = [];
      cols = [
        'maintenanceId'
      ];
      let pdfTemp=this.config.filterMachineDataForComparisionPdf(data, cols);
      this.pdfData = this.config.modifyDataForPdf(pdfTemp);
      this.pdfReady = true;
      this.loaded = false;
      this.loadedspinner = false;
    } else {
      this.loadedspinner = false;
      this.Errormsg = false;
      this.errMessage = this.error.getErrorMessage(1);
    }
  }

  private handleError(err, id = 0) {
    this.loaded = true;
    this.loadedspinner = false;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.config.throwError(err);
  }
  getDetails(url: string, machine) {
    this.router.navigate([url, { machineId: machine.id, machineName: machine.machineName }]);
  }
}

export interface Maintenance {
  machine?: any;
  maintenance_date?: string;
  maintenance_hours?: number;
  remaining_hours?:number;
  progress?:any;
}
