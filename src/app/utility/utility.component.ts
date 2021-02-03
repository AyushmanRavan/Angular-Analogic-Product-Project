import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {  MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { UtilityService } from "./utility.service";
import { GlobalErrorHandler } from "../core/services/error-handler";
import { DATA } from "../core/data.enum";
import { StorageServiceService } from "../core/services/auth/storage-service.service";

@Component({
  selector: "app-utility",
  templateUrl: "./utility.component.html",
  styleUrls: ["./utility.component.scss"]
})
export class UtilityComponent implements OnInit {

  plantOptions: any[];
  PlantName: string;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  data = new MatTableDataSource<any>();
  datasetLength: number = 0;

  loadedSpinner: boolean = true;
  Errormsg: boolean;
  loaded: boolean = true;
  errMessage: string;
  isPaginatorLoading: boolean;

  @ViewChild(MatPaginator)  paginator: MatPaginator;

  constructor(
    private error: GlobalErrorHandler,
    private utilityservice: UtilityService,
    private storageServiceService: StorageServiceService
  ) { }

  ngOnInit() {
    this.storageServiceService.setStorageItem(DATA.LAST_ACTION, Date.now().toString());
  }


  onSelect(e) {
    this.loadedSpinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.getUtilityDetails(e.machineID);
  }


  private getUtilityDetails(id: number) {
    this.utilityservice.getUtilityDetails(id, 0, 0).subscribe(data => {
      this.setData(data)
    });
  }


  private setData(data) {
    if (data.length > 0) {
      this.data = new MatTableDataSource<any>(data);
      this.data.paginator = this.paginator;
      this.displayedColumns = [];
      this.columnsToDisplay = [];
      for (let key in data[0]) {
        this.displayedColumns.push(key);
        this.columnsToDisplay.push(key);
      }
      this.loaded = false;
      this.Errormsg = true;
      this.loadedSpinner = false;
    }
    else {
      this.loaded = true;
      this.loadedSpinner = false;
      this.Errormsg = false;
      this.errMessage = this.utilityservice.getErrorMessage(1);
    }
  }
}
