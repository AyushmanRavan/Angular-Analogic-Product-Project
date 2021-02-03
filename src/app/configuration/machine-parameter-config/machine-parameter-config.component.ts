import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { Subscription } from 'rxjs';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from '../shared/config';
import { MachineParameterConfigDialogComponent } from './machine-parameter-config-dialog/machine-parameter-config-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-machine-parameter-config',
  templateUrl: './machine-parameter-config.component.html',
  styleUrls: ['./machine-parameter-config.component.scss']
})
export class MachineParameterConfigComponent implements OnInit {
  machines: any[];
  selectedMachineName: string;
  // selectedMachine: string;
  actionMode: string;
  array: any;
  dataSource = new MatTableDataSource<any>();

  displayedColumns = [
    "Id", "Param Name", "Column Name",
    "Param Type", "Param DataType", "Default Value",
    "Unit", "Criticality", "Counted Param",
    "Real Param", "Min Count",
    "Max Count", "Reset Count", "Actions",
  ];

  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageSize = 10;
  totalSize = 0;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];


  constructor(private matPaginatorIntl: MatPaginatorIntl,
    private configurationService: ConfigurationService,
    public dialog: MatDialog) {
  
    this.loadAllMachines();
 
  }

  loadAllMachines() {
    this.configurationService.getMachineDetails("machine").subscribe(
      response => {
       
        this.machines = response;
        this.selectedMachineName = this.machines[0].assosiativeName;
        this.applySelectFilter(this.selectedMachineName);
      },
      error => {
       
      });
  }

  ngOnInit() {

    // this.selectedMachine = this.machines[1];
    // this.applySelectFilter(this.selectedMachine.assosiativeName);

  }

  ngAfterViewInit() {
    this.matPaginatorIntl.itemsPerPageLabel = "Records Per Page";
  }

  applySelectFilter(value) {
    // this.selectedMachine = null;
    // for (var i = 0; i < this.machines.length; i++) {
    //   if (this.machines[i].assosiativeName == value) {
    //     this.selectedMachine = this.machines[i];
    //   }
    // }

    this.selectedMachineName = value;

    this.subscriber = this.configurationService.getMachineParameter(value).subscribe(
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
      err => {
        this.handleError(err);
      })
  }

  private setTableData(data) {
    if (data && data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.array = data;
      this.totalSize = this.array.length;
      this.iterator();
    } else {
      this.errMessage = this.configurationService.getErrorMessage(1);
    }
    this.reset();
  }

  update(row, mode) {
    this.openDialogBox(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode, Object.assign({}, row)
    );
  }

  private openDialogBox(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    const dialogRef = this.dialog.open(MachineParameterConfigDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode),
        isOpenFromConfig: true
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data != 'string') {
        this.subscriber = this.configurationService.getMachineParameter(this.selectedMachineName).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.applySelectFilter(this.selectedMachineName);
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

  updateDataSet(pageEvent: any) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.iterator();
  }

  private iterator() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = (this.pageIndex + 1) * this.pageSize;
    this.dataSource = this.array.slice(startIndex, endIndex);
  }

  private handleError(err) {
    this.reset();
    this.errMessage = this.configurationService.getErrorMessage(0);
    this.configurationService.throwError(err);
  }

  private handleErrorOFNoMoreData() {
    this.reset();
    this.hiddenData = true;
    this.errhidden = false;
    this.errMessage = this.configurationService.getErrorMessage(1);
  }

  private reset() {
    this.loaded = true;
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }
}




// pagination(items, page, per_page) {

//   var page = page || 1,
//     per_page = per_page || 10,
//     offset = (page - 1) * per_page,

//     paginatedItems = items.slice(offset).slice(0, per_page),
//     total_pages = Math.ceil(items.length / per_page);

//   return {
//     page: page,
//     per_page: per_page,
//     pre_page: page - 1 ? page - 1 : null,
//     next_page: (total_pages > page) ? page + 1 : null,
//     total: items.length,
//     total_pages: total_pages,
//     data: paginatedItems
//   };
// }