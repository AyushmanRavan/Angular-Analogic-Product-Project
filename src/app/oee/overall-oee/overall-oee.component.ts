import * as moment from 'moment';
import { OeeService } from './../oee.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { catchError, startWith, switchMap } from "rxjs/operators";

import { Overall } from './overall';

@Component({
  selector: 'app-overall-oee',
  templateUrl: './overall-oee.component.html',
  styleUrls: ['./overall-oee.component.scss']
})
export class OverallOeeComponent implements OnInit {
  machineID: number;
  chartLabels: Array<any> = [];
  chartOptions: any;
  chartData: any[];
  chartColors: any[];
  dataSource = new MatTableDataSource<Overall>();
  displayedColumns = [];
  datasetLength: number = 0;
  machineName: number;
  empty: boolean = true;
  errMessage: string;
  loaded: boolean;
  hideProdColumn: boolean;
  isPaginatorLoading: boolean;
  subscriber: Subscription;
  Errormsg: boolean;
  @ViewChild(MatPaginator) energyPaginator: MatPaginator;

  constructor(private _intl: MatPaginatorIntl, private overall: OeeService,
    private route: ActivatedRoute) {
    this.setupChart();
    this.displayedColumns = this.overall.getEnergyTableColumns();

  }


  ngOnInit() {
    this.Errormsg = true;
    this.energyPaginator._intl.itemsPerPageLabel = "Records Per Page";

    this.route.params.forEach((params: Params) => (this.machineID = params['machineID']));
    this.loaded = false;
    this.empty = false;
  }


  ngAfterViewInit() {
    this.getEnergyDetails(this.machineID);

  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  private getEnergyDetails(machineID: number) {
    if (undefined !== name) {
      this.overall.getEnergyDetails(machineID, 0, 0)
        .subscribe(data => {
          this.setChartData(data);
          this.setData(data);
        }, err => {
          this.handleError(err);
        });
    }
  }

  private setChartData(data: Overall[] | any) {
    if (data != null) {
      this.empty = false;
      this.chartData = this.overall.getChartDataOee(data);
    } else {
      this.empty = true;
      this.Errormsg = false;
      this.errMessage = this.overall.getErrorMessage(1);
    }
    this.reset();
  }


  private setData(data: Overall[] | any) {
    if (data != null) {
      this.empty = false;
      this.dataSource = new MatTableDataSource<Overall>(data);
      this.dataSource.paginator = this.energyPaginator;
    } else {
      this.empty = true;
      this.Errormsg = false;
      this.errMessage = this.overall.getErrorMessage(1);
    }
    this.reset();
  }


  private handleError(err, id = 0) {
    this.reset();
    this.empty = true;
    this.errMessage = this.overall.getErrorMessage(id);
    this.overall.throwError(err);
  }

  private reset() {
    this.loaded = true;
    this.isPaginatorLoading = false;
  }


  private setupChart() {
    const chart = this.overall.getChartOptionsOee();
    this.chartLabels = chart.labels;
    this.chartOptions = chart.options;
    this.chartColors = chart.colors; 
  }
} 