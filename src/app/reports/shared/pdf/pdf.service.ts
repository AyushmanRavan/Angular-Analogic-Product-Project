import { Injectable } from "@angular/core";
import { capitalize } from "lodash";
import * as moment from "moment";
import { map, omit } from "lodash";
import { LOGO } from "./../logo";
import { REPORT } from "./../const";

declare var jsPDF: any;

/**
 * @author Hardik Pithva
 */
@Injectable()
export class PdfService {
  doc: any;
  reportModel: any;
  data: any = [];
  highlight: string;
  plants = [];
  chatArray = [];
  chartName = [];
  guagevalue = [];
  plantColumns = ['plantName', 'machineName',
    'totalGoodProduction', 'totalRejectProduction',
    'totalAlarms', 'energy_machine_wise_count',
    'machineProductionTime', 'machineIdleTime',
    'machineDownTime']
  oeeColumns = [
    'start_time',
    'end_time', 'operator_name', 'expectedProduction', 'good_part',
    'bad_part', 'overallPercentage', 'productionPercentage',
    'availablityPercentage', 'qualityPercentage', 'on_time']

  constructor() { }

  public headerInformation: any;
  public logo: any;

  createPdf(report, collection: any, highlight: string = "", plants, chartarray, chartname, guagevalue, headerInformation, logo) {
    this.headerInformation = headerInformation;
    this.logo = logo;
    let x = 10,
      y = 100,
      columns = [], alarmColumns = [],
      reportType = this.getReportType(report.type, report.shift, report.interval),
      cols;
    this.doc = new jsPDF();
    this.highlight = highlight;
    this.reportModel = report;
    this.chatArray = chartarray;
    this.chartName = chartname;
    this.guagevalue = guagevalue;
    this.data = collection.tableData;

    cols = Object.keys(this.data[0] || []);


    if (reportType === capitalize("Plant dashboard")) {
      let Plantcols = this.plantColumns;
      Plantcols.forEach(col => {
        columns.push({
          title: this.getColumn(col, reportType, plants, 0),
          dataKey: col
        });
      });
    }
    else if ((reportType === capitalize("Oee day wise")) || (reportType === capitalize("Oee shift wise")) || (reportType === capitalize("Oee hour wise"))) {
      let Oeecols = this.oeeColumns;
      Oeecols.forEach(col => {
        columns.push({
          title: this.getColumn(col, reportType, plants, 0),
          dataKey: col
        });
      });
    }
    else {
      cols.forEach(col => {
        columns.push({
          title: this.getColumn(col, reportType, plants, 0),
          dataKey: col
        });
      });
    }

    // for Headeing --------------------------------------------------------------
    if (reportType === capitalize("plant Comparison")) {
      if (this.plants.length != 0) {
        while (this.plants.length > 0) {
          this.plants.pop();
        }
      } //empty 
      this.plants.push(plants[0]);
      this.plants.push(plants[1]);
    }

    if (reportType === capitalize(REPORT.PLANT_DASHBOARD)) {

      this.doc.setTextColor(51, 51, 51);
      this.doc.setFontSize(12);
      this.doc.setFontStyle("bold");
      y += 5;
    }


    if (reportType === capitalize(REPORT.PROD)) {
      this.doc.setTextColor(51, 51, 51);
      this.doc.setFontSize(12);
      this.doc.setFontStyle("bold");
      y += 10;
    }


    if (reportType === capitalize(REPORT.ALM)) {
      let alramData = collection.tableAlarmData.data, alarmCols = Object.keys(alramData[0] || []);
      alarmCols.forEach(col => {
        alarmColumns.push({
          title: this.getColumn(col, reportType, plants, 0),
          dataKey: col
        });
      });
      if (alarmCols.length > 0) {
        this.doc.autoTable(alarmColumns, alramData, this.getTableOptions(y));
        y = this.doc.autoTable.previous.finalY + 15;
      }
    }


    if (this.reportModel.type.toUpperCase() === "oee".toUpperCase()) {
      y += 65;
      this.doc.autoTable(columns, this.data, this.getTableOptions(y));
    } else {
      this.doc.autoTable(columns, this.data, this.getTableOptions(y));
    }


    this.doc.save(
      `${reportType} Report (${this.getDateTime(
        report.from
      )} to ${this.getDateTime(report.to)}) .pdf`
    );
  }




  private getDateTime = date => moment(date).format("MMM D, YYYY h:mm:ss a");


  private getColumn(title, type, plants, i) {
    let tempTitle = title;
    switch (type) {
      case "Energy":
        if (title == "Start Date-Time") tempTitle = "Start DateTime";
        if (title == "End Date-Time") tempTitle = "End DateTime";
        break
      case "Alarm":
        if (title == "name") tempTitle = "Name";
        if (title == "count") tempTitle = "Count";
        if (title == "duration") tempTitle = "Duration";
        if (title == "alarmName") tempTitle = "Alarm Name";
        if (title == "alarmIntime") tempTitle = "Alarm Intime";
        if (title == "alarmOntime") tempTitle = "Alarm Ontime";
        break
      case "Utility":
        {
          if (title == "Start Date-Time") tempTitle = "Start DateTime";
          if (title == "End Date-Time") tempTitle = "End DateTime";
          if (title == "Leaving_condenser_liquid") tempTitle = "L.Con.Liq";
          if (title == "Enter_Condenser_Liquid") tempTitle = "E.Con.Liq";
          if (title == "Leaving_Evaporator_Liquid") tempTitle = "L.Eva.Liq";
          if (title == "Enter_Evaporator_Liquid") tempTitle = "E.Eva.Liq";
          if (title == "Discharge_Tempreture") tempTitle = "Dis.Temp";
          if (title == "Evaporator_Pressure") tempTitle = "Eva.Press";
          if (title == "Discharge_Pressure") tempTitle = "Dis.Press";
          if (title == "Oil_Pressure") tempTitle = "Oil.Press";

        }
        break;

      case "Production":
        if (title == "startDate") tempTitle = "Start DateTime";
        if (title == "endDate") tempTitle = "End DateTime";
        if (title == "perHrsTotalProduction") tempTitle = "TotalProd(pkts)";
        if (title == "perHrsGoodProduction") tempTitle = "GoodProd(pkts)";
        if (title == "perHrsRejectProduction") tempTitle = "RejectedProd(pkts)";
        break;

      case "Machine":
        if (title == "start_time") tempTitle = "Start DateTime";
        if (title == "end_time") tempTitle = "End DateTime";
        if (title == "status") tempTitle = "Status";
        if (title == "reason") tempTitle = "Reason";
        break;

      case "Plant dashboard":
        {
          if (title == "plantName") tempTitle = "plantName";
          if (title == "machineName") tempTitle = "MachineName";
          if (title == "totalGoodProduction") tempTitle = "GoodProd";
          if (title == "totalRejectProduction") tempTitle = "RejectedProd";
          if (title == "totalAlarms") tempTitle = "Alarms";
          if (title == "energy_machine_wise_count") tempTitle = "Energy"
          if (title == "machineProductionTime") tempTitle = "ProdTime";
          if (title == "machineIdleTime") tempTitle = "IdleTime";
          if (title == "machineDownTime") tempTitle = "StoppageTime";
        }
        break;


      case "Plant comparison":
        {
          if (title == "parameter") tempTitle = "Parameter";
          if (title == "plant1") tempTitle = "Plant:" + plants[0];
          if (title == "plant2") tempTitle = "Plant:" + plants[1];
        }
        break;

      case "Oee hour wise":
      case "Oee day wise":
      case "Oee shift wise":
        {
          if (title == "start_time") tempTitle = "Start DateTime";
          if (title == "end_time") tempTitle = "End DateTime";
          if (title == "availablityPercentage") tempTitle = "Availablity(%)";
          if (title == "overallPercentage") tempTitle = "Oee(%)";
          if (title == "productionPercentage") tempTitle = "Productivity(%)";
          if (title == "qualityPercentage") tempTitle = "Quality(%)";
          if (title == "expectedProduction") tempTitle = "ExpectedProd";
          if (title == "good_part") tempTitle = "GoodProd";
          if (title == "bad_part") tempTitle = "RejectedProd";
          if (title == "on_time") tempTitle = "OnTime";
        }
        break;
      case "machine Maintenance":
      {
        if (title == "maintenance_date") tempTitle = "Maintenance Date";
        if (title == "maintenance_hours") tempTitle = "Maintenance Hours";
        if (title == "remaining_hours") tempTitle = "Remaining Hours";
        if (title == "progress") tempTitle = "Progress";
      }
      break;
    }
    return tempTitle;
  }

  private getReportType(type, shift, interval) {
    let name = "";
    switch (type) {
      case REPORT.PROD:
        name = REPORT.PROD;
        break;

      case REPORT.ALM:
        name = REPORT.ALM;
        break;

      case REPORT.MC:
        name = REPORT.MC;
        break;

      case REPORT.MC_ENG:
        name = "energy";
        break;

      case REPORT.MC:
        name = "floor";
        break;

      case REPORT.UTILITY:
        name = REPORT.UTILITY;
        break;

      case REPORT.MC_COMPARISON:
        name = "machine Comparison";
        break;

      case REPORT.PLANT_DASHBOARD:
        name = "plant Dashboard";
        break;

      case REPORT.PLANT_COMPARISON:
        name = "plant Comparison";
        break;

      case REPORT.DYNAMIC:
        name = "dynamic";
        break;

      case REPORT.MAINTENANCE:
        name = "machine Maintenance";
        break;

      case REPORT.VIEWALLMACHINEMAINTENANCE:
        name = "machine Maintenance";
        break;

      case REPORT.OEE:
        if ((interval == 'Day') && ((shift == null) || (shift.length <= 0))) {
          name = "oee day wise";
        }
        if ((interval == 'Hour') && (shift == null) || (shift.length <= 0)) {
          name = "oee hour wise"
        }
        if ((interval == 'Day') && ((shift != null) || (shift.length >= 0))) {
          name = "oee shift wise";
        }
    }

    return capitalize(name);

  }


  private getTableOptions(y) {
    return {
      startY: y + 10,
      theme: 'grid',
      margin: { top: 110, left: 20 },
      fillColor: this.getBrandColor(),
      styles: {
        cellPadding: 1, overflow: 'linebreak', halign: 'center',
        align: 'center'
      },
      columnStyles: {
        1: { columnWidth: 'auto' }
      },
      headerStyles: { columnWidth: 'wrap', fillColor: this.getBrandColor() },
      addPageContent: (this.pageContent)
    };
  }

  pageContent = data => {
    let x = 10,
      y = 10,
      lineWidth = 0.7,
      vendor,
      address,
      pageHeight = this.doc.internal.pageSize.height,
      width = this.doc.internal.pageSize.width,
      rgb = this.getBrandColor(),
      reportType = this.getReportType(this.reportModel.type, this.reportModel.shift, this.reportModel.interval),
      reportName = this.reportModel.reportName;
    rgb = this.getBrandColor();

    if (this.logo != undefined) {
      this.doc.addImage(this.logo, "png", x, y, 70, 20);
    } else {
      this.doc.addImage(LOGO, "png", x, y, 70, 20);
    }
    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFontStyle("bold");
    this.doc.setTextColor(51, 51, 51);
    if (this.headerInformation != undefined) {
      vendor = this.headerInformation.companyName;
      address = this.headerInformation.companyAddress;
      this.doc.text(vendor, x + 75, y);
      y += 5;
      this.doc.setFontSize(8);
      this.doc.text(address, x + 80, y);
    } else {
      vendor = "Analogic Automation Pvt Ltd.";
      address = "Survey No.45/13/1&2,Narhe Road,Pune,Maharashtra 411041";
      this.doc.text(vendor, x + 75, y);
      y += 5;
      this.doc.setFontSize(8);
      this.doc.text(address, x + 80, y);
    }
    y += 10;

    //summary and details
    this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    this.doc.setLineWidth(lineWidth);
    this.doc.line(10, y, width - 10, y);
    this.doc.setFontSize(16);
    this.doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    y += 10;
    this.doc.text(`${reportType} Report`, x, y);
    this.doc.setTextColor(51, 51, 51);
    this.doc.setFontSize(13);
    this.doc.setFontStyle("normal");
    y += 10;
    if (this.reportModel.type.toUpperCase() === "plantsDashboardReport".toUpperCase()) {
      this.doc.text("Plant Name:", x, y);
      this.doc.text(this.data[0].plantName, x + 30, y);  //get plant from collection
      y += 10;
      this.doc.text("From:", x, y);
      this.doc.text(this.getDateTime(this.reportModel.from), x + 15, y);
      this.doc.text("To:", x + 75, y);
      this.doc.text(this.getDateTime(this.reportModel.to), x + 85, y);
      y += 8;
      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;
      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );

    }

    else if (this.reportModel.type.toUpperCase() === "plantComparisonReport".toUpperCase()) {
      y += 8;
      this.doc.text("From:", x, y);
      this.doc.text(this.getDateTime(this.reportModel.from), x + 30, y);
      y += 10;
      this.doc.text("To:", x, y);
      this.doc.text(this.getDateTime(this.reportModel.to), x + 30, y);
      y += 8;
      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;
      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );

    }
    else if (this.reportModel.type.toUpperCase() === "machineComparisonReport".toUpperCase()) {
      y += 8;
      this.doc.text("From:", x, y);
      this.doc.text(this.getDateTime(this.reportModel.from), x + 30, y);
      y += 10;
      this.doc.text("To:", x, y);
      this.doc.text(this.getDateTime(this.reportModel.to), x + 30, y);
      y += 8;
      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;
      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );

    }
    else if (this.reportModel.type.toUpperCase() === "oee".toUpperCase()) {
      this.doc.text("Plant:", x, y);
      this.doc.text(this.reportModel.plant, x + 30, y);
      this.doc.text("From:", x + 80, y);
      this.doc.text(this.getDateTime(this.reportModel.from), x + 100, y);
      y += 8;
      this.doc.text("Department:", x, y);
      this.doc.text(this.reportModel.department, x + 30, y);
      this.doc.text("To:", x + 80, y);
      this.doc.text(this.getDateTime(this.reportModel.to), x + 100, y);
      y += 8;
      this.doc.text("Assembly:", x, y);
      this.doc.text(this.reportModel.assembly, x + 30, y);
      if (this.reportModel.shift != undefined) {
        this.doc.text("Shift:", x + 80, y);
        let count = x + 100;
        let comma = ',';
        for (let index in this.reportModel.shift) {
          if (parseInt(index) == this.reportModel.shift.length - 1) {
            comma = '.';
          }
          this.doc.text(`${this.reportModel.shift[index]}${comma}`, count, y);
          count = count + this.reportModel.shift[index].length * 2.5;
        }
      }
      y += 8;
      this.doc.text("Machine:", x, y);
      this.doc.text(this.reportModel.machine, x + 30, y);
      y += 5;

      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;
      if (this.chatArray.length > 0) {
        if (data.pageCount == 1) {
          this.doc.text(`${this.chartName[0]}%`, x + 50, y + 35)
          this.doc.text(`${this.chartName[1]}%`, x + 113, y + 35)
          this.doc.text(`${this.chartName[2]}%`, x + 45, y + 75)
          this.doc.text(`${this.chartName[3]}%`, x + 118, y + 75)

          this.doc.text(this.guagevalue[0], x + 53, y + 25)
          this.doc.text(this.guagevalue[1], x + 120, y + 25)
          this.doc.text(this.guagevalue[2], x + 53, y + 65)
          this.doc.text(this.guagevalue[3], x + 120, y + 65)
        }
      }

      if (this.chatArray.length > 0) {
        if (data.pageCount == 1) {
          for (let i = 0; i < this.chatArray.length - 2; i++) {
            this.doc.addImage(this.chatArray[i], x + 30, y, 50, 50)
            x += 70;
          }
          x = 10;
          y += 40;
          for (let i = 2; i < this.chatArray.length; i++) {
            this.doc.addImage(this.chatArray[i], x + 30, y, 50, 50)
            x += 70;
          }
        }
      }
      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );
    }

    else if (this.reportModel.type.toUpperCase() === "utility".toUpperCase()) {
      this.doc.text("Plant:", x, y);
      this.doc.text(this.reportModel.plant, x + 30, y);
      this.doc.text("From:", x + 80, y);
      this.doc.text(this.getDateTime(this.reportModel.from), x + 100, y);
      y += 8;
      this.doc.text("Department:", x, y);
      this.doc.text(this.reportModel.department, x + 30, y);
      this.doc.text("To:", x + 80, y);
      this.doc.text(this.getDateTime(this.reportModel.to), x + 100, y);
      y += 8;
      this.doc.text("Assembly:", x, y);
      this.doc.text(this.reportModel.assembly, x + 30, y);

      y += 8;
      this.doc.text("Machine:", x, y);
      this.doc.text(this.reportModel.machine, x + 30, y);
      y += 5;

      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;



      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );
    }

    else if (this.reportModel.type.toUpperCase() === "maintenance".toUpperCase()) {
      this.doc.text("Plant:", x, y);
      this.doc.text(this.reportModel.plantName, x + 30, y);
      y += 5;
      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;
      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );
    }
    else if (this.reportModel.type.toUpperCase() === "viewAllMachineMaintenance".toUpperCase()) {
      this.doc.text("Plant:", x, y);
      this.doc.text(this.reportModel.plants, x + 30, y);
      this.doc.text("Department:", x + 80, y);
      this.doc.text(this.reportModel.departments, x + 115, y);
      y += 8;
      this.doc.text("Assembly:", x, y);
      this.doc.text(this.reportModel.assemblys, x + 30, y);
      this.doc.text("Machine:", x + 80, y);
      this.doc.text(this.reportModel.machineName, x + 115, y);
      y += 5;
      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;
      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );
    }
    else {

      this.doc.text("Plant:", x, y);
      this.doc.text(this.reportModel.plant, x + 30, y);
      this.doc.text("From:", x + 80, y);
      this.doc.text(this.getDateTime(this.reportModel.from), x + 115, y);
      y += 8;
      this.doc.text("Department:", x, y);
      this.doc.text(this.reportModel.department, x + 30, y);
      this.doc.text("To:", x + 80, y);
      this.doc.text(this.getDateTime(this.reportModel.to), x + 115, y);
      y += 8;
      this.doc.text("Assembly:", x, y);
      this.doc.text(this.reportModel.assembly, x + 30, y);
      this.doc.text("Interval (mins):", x + 80, y);
      this.doc.text(
        this.getIntervalValue(
          this.reportModel.interval,
          reportType.toLowerCase()
        ),
        x + 115,
        y
      );
      y += 8;
      this.doc.text("Machine:", x, y);
      this.doc.text(this.reportModel.machine, x + 30, y);
      y += 5;
      this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
      this.doc.setLineWidth(lineWidth);
      this.doc.line(10, y, width - 10, y);
      y += 5;
      if (data.pageCount == 1) {
        if (this.highlight.length <= 30) {
          let CharCount = 30;
          let h = 0;
          let lineCount = this.highlight.length / CharCount;
          this.doc.setFillColor(62, 108, 365);
          h = h + (lineCount * 14);
          this.doc.rect(x, y + 5, 193, h, "F");
          this.doc.setTextColor(255, 255, 255);
          this.doc.setFontSize(13);
          this.doc.setFontStyle("bold");
          y += 10;
          var splitTitle = this.doc.splitTextToSize(this.highlight, 180);
          this.doc.text(splitTitle, x, y);
        }
        else {
          let CharCount = 90;
          let h = 0;
          let lineCount = this.highlight.length / CharCount;
          this.doc.setFillColor(62, 108, 365);
          h = h + (lineCount * 14);
          this.doc.rect(x, y + 5, 193, h, "F");
          this.doc.setTextColor(255, 255, 255);
          this.doc.setFontSize(13);
          this.doc.setFontStyle("bold");
          y += 10;
          var splitTitle = this.doc.splitTextToSize(this.highlight, 180);
          this.doc.text(splitTitle, x, y);
        }
      }

      const totalPagesExp = "{total_pages_count_string}";
      let str = "Page " + data.pageCount;
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontStyle("normal");
      this.doc.text(str, 10, pageHeight - 12);
      this.doc.text(
        "Created on: " + new Date().toLocaleString(),
        150,
        pageHeight - 12
      );
      this.doc.text(
        "Designed and developed by: Analogic Automation Private Limited",
        55,
        pageHeight - 7
      );
    }
  }
  private getIntervalValue = (val: string, type: string) =>
    type === REPORT.PROD || type === REPORT.ENG || type === REPORT.DYNAMIC || type === REPORT.UTILITY ? val
      : REPORT.NA;

  private getBrandColor = () => [71, 66, 184];

}