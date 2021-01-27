import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { ReportsService } from "../../reports.service";
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from "@angular/router";
import { GlobalErrorHandler } from "../../../core/services/error-handler";

@Component({
  selector: 'app-view-maintenance',
  templateUrl: './view-maintenance.component.html',
  styleUrls: ['../machine-maintenance.scss']
})
export class ViewMaintenanceComponent {
  machineName: string = '';
  machineId: number;
  maintenanceId: number;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = [
    'machine',
    'maintenance_date',
    'maintenance_hours',
    'remaining_hours',
    'progress'
  ];
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  subscriber: Subscription;
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;

  constructor(private error: GlobalErrorHandler, private router: Router, private route: ActivatedRoute, private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ReportsService) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if(params.machineName!=undefined)
      this.machineName = params.machineName;
      if(params.machineId!=undefined)
      this.machineId = params.machineId;
    });
    this.getDefaultSet(this.machineId);
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


  getDefaultSet(id) { 
    this.subscriber =  this.config.getMachineWiseID(id).subscribe(data=>{
       this.reportVal = { ...data, type: "viewAllMachineMaintenance" };
    });
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.subscriber = this.config.getMachineWiseMaintenanceDetails(id).subscribe(data => { this.pdfReady = false; this.setData(data) }, err => this.handleError(err));
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

  onNavigate(url: string) {
    this.router.navigate([url]);
  }

}

export interface Maintenance {
  machine?: any;
  maintenance_date?: string;
  maintenance_hours?: number;
  remaining_hours?:number;
  progress?:any;
}
