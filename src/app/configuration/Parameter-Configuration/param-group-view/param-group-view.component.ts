import { Component, OnDestroy,ViewChild } from "@angular/core";
import { MatPaginator,MatDialog, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { Subscription } from "rxjs/Subscription";

import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from "../../shared/config";
import { ConfigurationService } from "../../configuration.service";
import { ParamGroupAddComponent } from "../param-group-view/param-group-add/param-group-add.component";

@Component({
  selector: "app-param-group-view",
  templateUrl: "./param-group-view.component.html",
  styleUrls: ['../../configstyle.scss']
})
export class ParamGroupViewComponent implements OnDestroy {
  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  dialogRef;
  displayedColumns =  [
    "paramName",
    "paramType",
    "defaultValue",
    "length",
    "criticality",
    "countedParam"
  ];
  pg_name: any;
  imported_parameters = [];
  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;
  datasetLength:number;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  currentPage = 0;
  pageSize = 10;
  array: any;


  constructor(private _intl:MatPaginatorIntl,private config: ConfigurationService, public dialog: MatDialog) {
    this.getDefaultSet(0,0);
  }

  getDefaultSet(limit,offset){
     this.subscriber = this.config.getParameterGroupDetails(limit,offset).subscribe(
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
    this._intl.itemsPerPageLabel="Records Per Page"; 
   }

  

  addParamGroup(mode = "add") {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS(500, 650), mode, {});
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  update(row, mode) {
    this._dialog(
      mode === MODE.UPDATE
        ? ADD_UPDATE_DIALOG_OPTIONS(500, 650)
        : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(ParamGroupAddComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode)
      }
    });

    this.dialogRef.afterClosed().subscribe((data:any) => {
    
      if (typeof data != "string") {
        this.subscriber = this.config.getParameterGroupDetails(0,0).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex=0;
              this.getDefaultSet(0,0);
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

  
  private handleError(err) {
    this.reset();
    this.errMessage = this.config.getErrorMessage(0);
    this.config.throwError(err);
  }

  private handleErrorOFNoMoreData() {
    this.reset();
    this.hiddenData = true;
    this.errhidden=false;
    this.errMessage = this.config.getErrorMessage(1);
  }

  private reset() {
    this.loaded = true;
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
    }else {
      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
  }
}
