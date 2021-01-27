import { Injectable } from "@angular/core";
import { RestApi } from "../core/services/rest.service";
import { omit } from "lodash";
import { GlobalErrorHandler } from '../core/services/error-handler';
import { sumBy, groupBy } from 'lodash';
import { REPORT } from './shared/const';
import * as moment from "moment";
import { capitalize, map, head, sortBy, orderBy } from 'lodash';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable()
export class ReportsService {
  constructor(private http: HttpClient, private rest: RestApi, private error: GlobalErrorHandler) { }

  getMachineCompareData = data => {
    let tempData = Object.assign({}, data);

    tempData.from = this.formatDate(data.from);
    tempData.to = this.formatDate(data.to);

    if (tempData.firstMachineId != "") tempData.firstMachineId = tempData.firstMachineId['id'];
    if (tempData.secondMachineId != "") tempData.secondMachineId = tempData.secondMachineId['id'];
    if (tempData.thirdMachineId != "") tempData.thirdMachineId = tempData.thirdMachineId['id'];
    if (tempData.fourthMachineId != "") tempData.fourthMachineId = tempData.fourthMachineId['id'];

    return this.rest.post(`productionMachine/comparision`, tempData);
  };

  getHeadersForSummary = (reportId, tableType) => this.rest.get(`config/reportHeadings/${reportId}/${tableType}`);

  getHeadersForMonitoring = (reportId, tableType) => this.rest.get(`config/reportHeadings/${reportId}/${tableType}`);

  getDynamicReportForMonitoring = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    input_parameter,
    oeeType,
    shift,
    limit = 0,
    offset = 0
  ) =>
    this.rest
      .post(`getGenericDataTypeWise/report`, {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        input_parameter,
        oeeType,
        shift,
        limit,
        offset
      });

  getDynamicReportForSummary = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    input_parameter,
    oeeType, shift,
    limit = 0,
    offset = 0
  ) =>
    this.rest
      .post(`getGenericSummeryTypeWise/report`, {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        input_parameter,
        oeeType, shift,
        limit,
        offset
      });


  getChartData = (
    chartId,
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    input_parameter,
    oeeType, shift,
    limit = 0,
    offset = 0
  ) =>
    this.rest
      .post(`dynamicChart/report`, {
        chartId,
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        input_parameter,
        oeeType, shift,
        limit,
        offset
      });




  getPlantWiseMachineDetails = (name: number, limit: number = 0, offset = 0) =>
    this.rest.get(`plantDashboard/${name}/?limit=${limit}&offset=${offset}`);

  getTotalProductionAndProductionCost = (name: number) =>
    this.rest.get(`plantDashboardTotalProduction/${name}`);

  getTotalEnergyAndEnergyCost = (name: number) =>
    this.rest.get(`plantDashboardTotalEnergy/${name}`);

  getPlantWiseMachine = (plantId, machineArray) => this.rest.post(`filter/remove/productionMachines`, { plantId, machineArray });

  getPlant1Valuess = (name: number) => this.rest.get(`plantComparision/${name}`);
  getPlant2Valuess = (name: number) => this.rest.get(`plantComparision/${name}`);

  getPlant = () => this.rest.get("config/plants");////
  getDept = id => this.rest.get(`config/department/filter/${id}`);//
  getAssembly = id => this.rest.get(`config/assembly/filter/${id}`);//
  getMachineNames = (plant, department, assembly, reportType, flag) =>
    this.rest
      .post("config/machine/filter", {
        plant,
        department,
        assembly,
        reportType,
        flag
      });

  getParameters(machineId: number) {
    return this.rest.get("config/machineParametersById/filter/" + machineId);
  }

  getPlantCompareData(plants, from, to) {
    let tempData = Object.assign({});
    tempData.plants = plants;
    tempData.from = this.formatDate(from);
    tempData.to = this.formatDate(to);
    return this.rest.post(`plantComparision/report`, tempData);
  }

  getPlantDashboardSummary = (id: number) => this.rest.get(`plantComparision/${id}`);

  getPlantDashboardReport = (plants, from, to, limit, offset) =>
    this.rest.post("plantDashboard/report", { plants, from, to, limit, offset });



  filterMachineDataForComparisionPdf = (machines, omittedColumns) =>
    machines.map(item => omit(item, omittedColumns));



  getEnergyReport = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    input_array,
    limit = 0,
    offset = 0
  ) =>
    this.rest
      .post(`energy/report`, {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        input_array,
        limit,
        offset
      });

  getUtilityReport = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    limit = 0,
    offset = 0
  ) =>
    this.rest
      .post("utility/report", {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        limit,
        offset
      });

  getProductionReport = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    limit,
    offset
  ) =>
    this.rest
      .post("production/report", {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        limit,
        offset
      });

  getAlarmReport = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    limit,
    offset
  ) =>
    this.rest
      .post("alarm/report", {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        limit,
        offset
      });

  getOeeReport = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    limit,
    offset
  ) =>
    this.rest
      .post("Oeepercentage/report", {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        limit,
        offset
      });

  getOeeTableReport = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    oeeType,
    shift,
    limit,
    offset
  ) =>
    this.rest
      .post("oeeTypeWise/report", {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        oeeType,
        shift,
        limit,
        offset
      });


  getMachineReport = (
    plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    limit,
    offset
  ) =>
    this.rest
      .post("machine/report", {
        plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        limit,
        offset
      });

  generateReport = data => {
    let tempData = Object.assign({}, data);
    tempData.from = this.formatDate(data.from);
    tempData.to = this.formatDate(data.to);
    return this.rest.post(`${data.type}`, tempData);
  };

  prioritizeColumns = data => {
    let tempData = [];
    data.forEach(item => {
      tempData.push({
        "Start Date-Time": item.StartTime,
        "End Date-Time": item.EndTime,
        ...omit(item, ["StartTime", "EndTime"])
      });
    });
    return tempData;
  };

  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss.SSS");
  formatDateOee = dt => moment(dt).format("YYYY-MM-DD 00:00:00.000");

  toDate = (datetime: string) => moment(datetime).toDate();

  //For Calender
  getDate = (today?: boolean) => {
    let _today = this._getDate(true),
      _yesterday = this._getDate();
    return this.toDate(`${today ? _today : _yesterday} 12:00`);
  };

  private _getDate = (today?: boolean) =>
    today
      ? moment().format("YYYY-MM-DD")
      : moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD");

  generateAssemblyReport = data => {
    let tempData = Object.assign({}, data);
    tempData.from = this.formatDate(data.from);
    tempData.to = this.formatDate(data.to);
    //tempData.machineName = 'Assembly1';
    return this.rest.post(`assemblyWiesSummeryOeeReport`, tempData);
  };

  getPlantDashboardHighlight = (data: any): string => {
    let production, productionCost, energy, energyCost;
    production = data.totalProduction;
    productionCost = data.totalProductionCost;
    energy = data.totalEnergyUnit;
    energyCost = data.totalEnergyCost;
    return `Total Production:${production} | Total Prodcution Cost:${productionCost} | Total Energy:${energy} | Total Energy Cost:${energyCost}`;
  };

  getAssemblyTableData(data): any {
    let tempData = [];
    let displayedColumns,
      cols = {};

    const { columns, columnsDefs } = this.getTableOptions(data);
    displayedColumns = columns;
    cols = columnsDefs;
    tempData = data;
    return {
      displayedColumns,
      columns: cols,
      data: tempData
    };
  }

  getTableOptions = data => {
    let columns = [],
      columnsDefs = [];

    columns.push(
      "start_time",
      "end_time",
      "overallpercentage",
      "availablityPercentage",
      "qualityPercentage",
      "good_part",
      "total_production",
      "on_time"
    );
    columnsDefs.push(
      {
        columnDef: "start_time",
        header: "Start Time",
        cell: row => `${row.start_time}`
      },
      {
        columnDef: "end_time",
        header: "Start Time",
        cell: row => `${row.end_time}`
      },
      {
        columnDef: "overallpercentage",
        header: "Start Time",
        cell: row => `${row.overallpercentage}`
      },
      {
        columnDef: "availablityPercentage",
        header: "Start Time",
        cell: row => `${row.availablityPercentage}`
      },
      {
        columnDef: "qualityPercentage",
        header: "Start Time",
        cell: row => `${row.qualityPercentage}`
      },
      {
        columnDef: "good_part",
        header: "Start Time",
        cell: row => `${row.good_part}`
      },
      {
        columnDef: "total_production",
        header: "Start Time",
        cell: row => `${row.total_production}`
      },
      {
        columnDef: "on_time",
        header: "Start Time",
        cell: row => `${row.on_time}`
      }
    );
    return { columns, columnsDefs };
  };

  //Machine wise  oee report service call

  getmachineWiseOeePlant = () => this.rest.get("config/plants");
  getmachineWiseOeeDept = id => this.rest.get(`config/department/filter/${id}`);
  getmachinewiseOeeMachine = id =>
    this.rest.get(`config/assembly/filter/${id}`);

  getTimeDifference = data => {
    let { start_time, end_time } = data;
    start_time = moment(start_time);
    end_time = moment(end_time);
    return end_time.diff(start_time, 'seconds');
  };

  groupBy = (data, field) => groupBy(data, field);
  getSum = (obj, key) => sumBy(obj, key);
  getErrorMessage = errorId => this.error.getErrorMessage(errorId);
  throwError = (error: any) => this.error.handleError(error);

  getAlarmSummary(data = []) {
    let groupedObj = this.groupBy(data, 'alarmName'),
      keys = Object.keys(groupedObj),
      alarmSummary = [];

    keys.forEach((alarm, i) => {
      let tempAlarm: any[] = groupedObj[alarm],
        name = capitalize(head(tempAlarm).alarmName),
        duration,
        totalSeconds = 0,
        count = tempAlarm.length;
      map(
        tempAlarm,
        (item: any) =>
          (totalSeconds += moment.duration(item.alarmOntime).asSeconds())
      );
      var date = new Date(null);
      date.setSeconds(totalSeconds); // specify value for SECONDS here
      duration = date.toISOString().substr(11, 8);

      alarmSummary.push({ name, count, duration });
    });
    return this.sortBy(alarmSummary, 'duration');
  }
  sortBy = (collection: any, fields, by = ['desc']) =>
    orderBy(collection, [...fields], ['desc']);

  getHighLightForTable = (reportId, plantId,
    departmentId,
    assemblyId,
    machineId,
    from,
    to,
    interval,
    input_parameter,
    oeeType, shift
  ) => {
    return this.rest.postText(`highlight/report`,
      {
        reportId, plantId,
        departmentId,
        assemblyId,
        machineId,
        from,
        to,
        interval,
        input_parameter, oeeType, shift
      });
  }
  getChartDetails = (reportId, machineId) => this.rest.get(`config/reportChartAndLabels/${reportId}/${machineId}`);

  getHeader = () => this.rest.get(`config/pdf`);
  getLogoImage = (url) => this.rest.getLogoImage(url);



  addMaintenance = req =>
    this.rest.post("config/maintenance", req);

  updateMaintenance = req =>
    this.rest.put("config/maintenance", req);

  getMaintenanceDetails = (plantId) => this.rest.get(`config/plantById/${plantId}`);

  getMachineWiseMaintenanceDetails = (id) => this.rest.get(`config/machineById/${id}`);

  dataWithProgressCaluculation(collection) {
    map(collection, (item: any) => {
      var progress = ((item.maintenance_hours - item.remaining_hours) * 100) / item.maintenance_hours;
      var actualBarValue = Number(progress.toFixed(2));
      let barValue = '';
      let barColor = '';
      // for color value
      if (actualBarValue <= 0) {
        barValue = '100%';
      } else {
        barValue = actualBarValue + '%';
      }
      // for color
      if ((actualBarValue >= 0) && (actualBarValue <= 50)) {
        barColor = '#5cb85c';
      }
      else if ((actualBarValue >= 51) && (actualBarValue <= 75)) {
        barColor = '#ffa000'
      }
      else if ((actualBarValue >= 76) && (actualBarValue <= 99)) {
        barColor = '#f4511e'
      } else {
        barColor = 'red';
      }
      let barObject = Object();
      barObject.barValue = barValue;
      barObject.barColor = barColor;
      item.progress = barObject;
    });
    return collection;
  }

  modifyDataForPdf(data) {
    map(data, (item: any) => {
      item.machine = item.machine.machineName;
      item.progress = item.progress.barValue;
    });
    return data;
  }
  getTimeData(time: string, date: boolean = true) {
    const [hh, mm, ss] = time.split(":");
    let t = moment().set({
      hour: parseInt(hh),
      minute: parseInt(mm),
      second: 0,
      millisecond: 0
    });
    return date ? t.toDate() : t;
  }


  getMachineWiseID = (id) => this.rest.get(`config/machine/${id}`);


}
