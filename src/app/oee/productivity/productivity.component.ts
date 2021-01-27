import { Component, OnInit, ViewChild } from '@angular/core';
import { OeeService } from './../oee.service';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";
import { ActivatedRoute, Params } from "@angular/router";
import { Productivity } from './productivity';

@Component({
  selector: 'app-productivity',
  templateUrl: './productivity.component.html',
  styleUrls: ['./productivity.component.scss']
})
export class ProductivityComponent implements OnInit {
  barChartOptions: any;
  barChartLabels: number[] = [];
  barChartLegend: boolean = true;
  barChartData: any[];
  chartColors: Array<any> = [];
  displayedColumns = [];
  dataSource = new MatTableDataSource<Productivity>();
  datasetLength: number;
  machineID: number;
  empty: boolean = true;
  loaded: boolean;
  isPaginatorLoading: boolean;
  errMessage: string;

  subscriber: Subscription;
  total: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _intl: MatPaginatorIntl,
    private productivityservice: OeeService,
    private route: ActivatedRoute) {
    this.setupChart();
    this.displayedColumns = this.productivityservice.getTableColumnsProductivity();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";

    this.route.params.forEach(
      (params: Params) => (this.machineID = params['machineID'])
    );
    this.loaded = false;
    this.empty = false;
  }

  ngAfterViewInit() {
    this.getProductivityDetails(this.machineID);
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }


  private getProductivityDetails(name: number) {
    if (undefined !== name) {
      this.productivityservice.getProductivityDetails(name, 0, 0)
        .subscribe(
          data => this.setData(this.productivityservice.sortBy(data, "start_time")),
          err => this.handleError(err));

      this.productivityservice.getProductivityDetails(name, 0, 0)
        .subscribe(
          data => this.setDatachart(this.productivityservice.sortBy(data, "start_time")),
          err => this.handleError(err));
    }
  }
  private handleError(err, id = 0) {
    this.reset();
    this.empty = true;
    this.errMessage = this.productivityservice.getErrorMessage(id);
    this.productivityservice.throwError(err);
  }

  private reset() {
    this.loaded = true;
    this.isPaginatorLoading = false;
  }

  private setData(data: Productivity[] | any) {
    if (data.length > 0) {
      this.empty = false;
      this.barChartData = this.productivityservice.getChartDataProductivity(data);
      this.dataSource = new MatTableDataSource<Productivity>(data);
      this.dataSource.paginator = this.paginator;

    } else {
      this.empty = true;

    }
    this.reset();
  }


  private setDatachart(data: Productivity[] | any) {
    if (data.length > 0) {
      this.empty = false;
      this.barChartData = this.productivityservice.getChartDataProductivity(data);
    } else {
      this.empty = true;

    }
    this.reset();
  }

  private setupChart() {
    const chart = this.productivityservice.getChartOptionsProductivity();
    this.barChartOptions = chart.options;
    this.chartColors = chart.colors;
    this.barChartLabels = chart.labels;
  }

}
