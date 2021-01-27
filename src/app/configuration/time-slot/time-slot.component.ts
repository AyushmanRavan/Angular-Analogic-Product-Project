import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from '../shared/config';
import { ConfigurationService } from '../configuration.service';
import { TimeSlotDialogComponent } from './time-slot-dialog/time-slot-dialog.component';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-time-slot',
  templateUrl: './time-slot.component.html',
  styleUrls: ['../configstyle.scss']
})
export class TimeSlotComponent {
  ob=Object();
  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  loadedspinner: boolean = false;
  dialogRef;
  displayedColumns = [
    'start_time',
    'end_time',
    'status',
    'reason',
    'actions'
  ];
  errMessage: string;
  subscriber: Subscription;
  hiddenData: boolean=true;
  errhidden: boolean;
  datasetLength: number;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  currentPage = 0;
  pageSize=10;
  array:any;


  constructor(private _intl:MatPaginatorIntl,public dialog: MatDialog, private config: ConfigurationService, private fb: FormBuilder,) {
 
  }
  ngAfterViewInit() {
    this._intl.itemsPerPageLabel="Records Per Page"; 

  } 
  private getArray(ob,limit,offset)
  {
    this.subscriber = this.config.getSlotData(ob,0,0).subscribe(
      data => {  
        if (data == null) {
          this.handleErrorOFNoMoreData();
          this.hiddenData = true;
        } else {
          this.setTableData(this.ob,data);
          this.loadedspinner=false;
          this.hiddenData = false;
          this.errhidden = true;
        }
      },
      err => this.handleError(err)
    );
  }


  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  update(row, mode) {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS(270, 650),mode,Object.assign({}, row));
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(TimeSlotDialogComponent, {
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
        this.subscriber = this.config.getSlotData(this.ob,0,0).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.getArray(this.ob,0,0);
            }
            else {
              this.setTableData(this.ob,data);
              this.loadedspinner=false;
              this.hiddenData = false;
              this.errhidden = true;
            }
          },
          err => this.handleError(err)
        );
      }
    });
  }
  
  updateDataset(e:any)
  {
    this.currentPage=e.pageIndex;
    this.pageSize=e.pageSize;
    this.iterator();
  }
  
  private  iterator()
  {
    const end=(this.currentPage + 1)*this.pageSize;
    const start=this.currentPage  * this.pageSize;
    const part=this.array.slice(start,end);
    this.dataSource=part;
  }
  
  private setTableData(ob,data) {
    if (data && data.length > 0) {
      this.dataSource=new MatTableDataSource<any>(this.config.convertUtcToDataTime(data));
      this.dataSource.paginator=this.paginator;
      this.array=data;
      this.datasetLength=this.array.length;
      this.iterator();
    } else {
      this.errMessage = this.config.getErrorMessage(1);
      this.hiddenData=false;

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
    this.loadedspinner=false;
    this.hiddenData = true;
    this.errhidden = false;
    this.errMessage = this.config.getErrorMessage(1);

  }

  private reset() {
    this.hiddenData=false;
  }

  onSelect(event){
    this.loadedspinner=true;
    this.hiddenData = true;
    this.errhidden = true;
    this.ob=Object(event.reportValue)
    this.getArray(this.ob,10,1);
  }
 
}

