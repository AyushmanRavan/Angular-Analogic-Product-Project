import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { LOGO } from './../logo';

declare var jsPDF: any;

@Injectable()
export class NewPdfService {

  public halfInfo: any = { isPageHalf: false, Y: 0, present: false };
  public fullInfo: any = { isPageFull: false, Y: 0, present: false };
  public summaryInfo: any = { isPageSummary: false, Y: 0, present: false };
  public summaryFlag: boolean;
  public highlightInfo: any = { isPageHighlight: false, Y: 0, present: false };
  public monitoringFlag: boolean;
  doc: any;
  length: number;
  no_of_page: number;
  isHalf: boolean = false;
  pageCount: number;
  public headerInformation: any;
  public logo: any;
  reportFilter: any;

  constructor() { }

  createPdf(reportFilter, chartData, chartUrl, highlight, summarydata, monitoringHeaders, monitoringdata, headerInformation, logo) {
    
    this.headerInformation = headerInformation;
    this.logo = logo;
    this.doc = new jsPDF();
    let halfChartData = [];   // if want to add guage chart then add this array
    let fullChartData = [];
    if(chartData.guage.length>0)
    {
      halfChartData.push(...chartData.guage);
    }

    if(chartData.pie.length>0){
      halfChartData.push(...chartData.pie);
    }

    // if(chartData.doughnut.length>0){
    //   halfChartData.push(...chartData.doughnut);
    // }
   
    if(chartData.lineBar.length>0){
      fullChartData.push(...chartData.lineBar);
    }
    
  

    let halfChartUrl = [];
    let halfChartName = [];
    let fullChartName = [];
    let guageValue = [];

   
    if (chartData.guage.length>0) {
      for (let i = 0; i < halfChartData.length; i++) {
        halfChartName.push(halfChartData[i].chartName)    //half chart name
        if (halfChartData[i].chartType == 'guage') {
          guageValue.push(halfChartData[i].value);
        }
      }
    }

    for (let i = 0; i < fullChartData.length; i++) {
      fullChartName.push(fullChartData[i].chartName)    //full chart name
    }

    for (let i = 0; i < halfChartData.length; i++) {
      halfChartUrl.push(chartUrl[i]);
    }
    let fullChartUrl = [];
    for (let i = halfChartData.length; i < chartUrl.length; i++) {
      fullChartUrl.push(chartUrl[i]);
    }

    this.pageCount = 1;
    this.halfInfo = { isPageHalf: false, Y: 0, present: false };
    this.fullInfo = { isPageFull: false, Y: 0, present: false };
    this.summaryInfo = { isPageSummary: false, Y: 0, present: false };
    this.highlightInfo = { isPageHighlight: false, Y: 0, present: false };
    this.summaryFlag = false;
    this.monitoringFlag = false;


    if (halfChartData.length > 0) {
      this.halfInfo = this.halfChartOnPdf(reportFilter, halfChartUrl, halfChartData, halfChartName, guageValue);
    }


    if (fullChartData.length > 0) {
      this.halfInfo = this.fullChartOnPdf(reportFilter, fullChartUrl, fullChartData, fullChartName);
    }

    if (summarydata !== undefined) {
      this.summaryInfo = this.summaryData(reportFilter, summarydata);
    }

    if (highlight !== '') {
      this.highlightInfo = this.highlight(reportFilter, highlight);
    }

    if (monitoringdata !== undefined || monitoringdata != null) {
      this.monitoringData(reportFilter, monitoringHeaders, monitoringdata);
    }
    this.doc.save(`Report.pdf`);
  }

  monitoringData(reportFilter, monitoringHeaders, monitoringdata) {

    let y;
    let monitoringCols = Object.keys(monitoringdata[0] || []), monitoringColumns = [];
    let i = 0;

    if (monitoringColumns.length != 0) {
      while (monitoringColumns.length > 0) {
        monitoringColumns.pop();
      }
    } //empty

    monitoringCols.forEach(col => {
      monitoringColumns.push({
        title: this.getColumn(monitoringHeaders, 'dynamic', i++),
        dataKey: col
      });
    });    // for monitoring table ****get Col***


    if ((this.halfInfo.present == false) && (this.highlightInfo.present == false) && (this.summaryInfo.present == false)) {
      y = 90;
      this.monitoringFlag = true;
    } else {
      if (this.highlightInfo.present) {    //only highlight present
        if (this.highlightInfo.Y != 90) {
          y = this.highlightInfo.Y;
        } else {
          this.doc.addPage();
          this.monitoringFlag = true;
          y = 90;
        }
      }
      else {                               // highlight not present 
        if (this.summaryInfo.present) {      //if summary present
          if (this.summaryInfo.Y != 90) {
            y = this.summaryInfo.Y;
          } else {
            this.doc.addPage();
            this.monitoringFlag = true;
            y = 90;
          }
        } else {                          // no higlight ,no summary table then print after chart
          if ((this.halfInfo.present == true)) {
            if (this.halfInfo.isPageHalf) {
              y = 180;  // start From Half  
            } else {
              this.doc.addPage();
              this.monitoringFlag = true;
              y = 90;
            }
          }
        }
      }
    }
    this.doc.autoTable(monitoringColumns, monitoringdata, this.getTableOptionsMonitoring(y, reportFilter));
  }

  summaryData(reportFilter, summarydata) {
    let y = 0;

    if (this.halfInfo.present == true) {
      if (this.halfInfo.isPageHalf) {
        y = 180;  // start From Half 
      } else {
        y = 90;  // Full page
        this.doc.addPage();
        this.summaryFlag = true;
      }
    } else {
      y = 90;
      this.summaryFlag = true;
    }

    let summaryCols = Object.keys(summarydata[0] || []),
      summaryColumns = [];
    summaryCols.forEach(col => {
      summaryColumns.push({
        title: this.getColumn(col, 'dynamic', 0),
        dataKey: col
        // title: 'Summary',
        // dataKey: col
      });
    });

    this.doc.autoTable(summaryColumns, summarydata, this.getTableOptionsSummary(y, reportFilter));
    y = this.doc.autoTableEndPosY() + 10;
    if (y > 279) {
      return { isPageSummary: false, Y: 90, present: true };
    } else {
      return { isPageSummary: true, Y: y, present: true };
    }

  }

  highlight(reportFilter, highlight) {
    let h = 0, y = 0, x = 10;
    if (this.summaryInfo.present == true) {
      if (this.summaryInfo.Y == 90) {
        this.doc.addPage();
        this.pageAddition(reportFilter);
        y = 90;
      } else {
        y = this.summaryInfo.Y;
      }
    }
    else {
      if ((this.halfInfo.present == true)) {
        if (this.halfInfo.isPageHalf) {
          y = 180;        // if chart are present and occuiped half page
        } else {
          this.doc.addPage();                // No chart and summary table
          this.pageAddition(reportFilter);
          y = 90;
        }
      } else {                            // No chart and summary table
        this.pageAddition(reportFilter);
        y = 90;
      }
    }


    if (highlight.length <= 30) {
      let CharCount = 30;
      let lineCount = highlight.length / CharCount;
      this.doc.setFillColor(62, 108, 365);
      h = h + (lineCount * 12);
      this.doc.rect(x, y, 193, h, 'F');
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(13);
      this.doc.setFontStyle('bold');
      var splitTitle = this.doc.splitTextToSize(highlight, 180);
      this.doc.text(splitTitle, x, y + 5);
    }
    else {
      let CharCount = 90;
      let lineCount = highlight.length / CharCount;
      this.doc.setFillColor(62, 108, 365);
      h = h + (lineCount * 12);
      this.doc.rect(x, y, 195, h, 'F');
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(13);
      this.doc.setFontStyle('bold');
      var splitTitle = this.doc.splitTextToSize(highlight, 180);
      this.doc.text(splitTitle, x, y + 5);
    }
    y = y + h;
    if (y < 279) {
      return { isPageHighlight: true, Y: y + 2, present: true };
    } else {
      return { isPageHighlight: false, Y: 90, present: true };
    }

  }

  halfChartOnPdf(reportFilter, url, data, name, guageValue) {
  
    this.no_of_page = 0;
    let length = data.length;
    let guageCounter = 0;
    let firstPage = true;
    
    if (length % 4 > 0) {
      this.no_of_page = Math.floor((length / 4)) + 1;
    } else {
      this.no_of_page = Math.floor((length / 4))
    }

    let i = 0;
    while (i < this.no_of_page) {

      if ((i + 1) * 4 <= length) {
        if (firstPage == true) {
          this.pageAddition(reportFilter);  // For First page
          firstPage = false;
        } else {
          this.doc.addPage();
          this.pageAddition(reportFilter);
        }
        this.doc.setFontSize(15);
        this.doc.setFontStyle('bold');
        this.doc.setTextColor(51, 51, 51);


        for (let chartPosition = 0; chartPosition < 4; chartPosition++) {
          let firstGuageCoordinate = this.getGuagecoOrdinates(data[(i * 4) + chartPosition], chartPosition)
          if (firstGuageCoordinate != null) {
            this.doc.text(`${guageValue[guageCounter]}%`, firstGuageCoordinate[0], firstGuageCoordinate[1])
            guageCounter++;
          }
        }

        this.doc.setFontSize(15);
        this.doc.setFontStyle('bold');
        this.doc.setTextColor(51, 51, 51);


        this.doc.addImage(url[(i * 4)], 10, 90, 80, 90);
        this.doc.text(data[(i * 4)].chartName, 10, 90);

        this.doc.addImage(url[(i * 4) + 1], 100, 90, 80, 90);
        this.doc.text(data[(i * 4) + 1].chartName, 100, 90);

        this.doc.addImage(url[(i * 4) + 2], 10, 170, 80, 90);
        this.doc.text(data[(i * 4) + 2].chartName, 10, 170);

        this.doc.addImage(url[(i * 4) + 3], 100, 170, 80, 90);
        this.doc.text(data[(i * 4) + 3].chartName, 100, 170);

      } else {
        if (firstPage == true) {
          this.pageAddition(reportFilter);
          firstPage = false;
        } else {
          this.doc.addPage();
          this.pageAddition(reportFilter);
        }

        this.doc.setFontSize(15);
        this.doc.setFontStyle('bold');
        this.doc.setTextColor(51, 51, 51);
        switch (length % 4) {

          case 1:

            if (firstPage = false) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].chartType === 'guage') {
                  this.doc.text(`${data[i].value}%`, 42, 145);   // for guage value
                }
              }
            }

            if (firstPage = true) {
              let x: number = 42, y: number = 145;
              for (let i = 4; i < data.length; i++) {
                if (data[i].chartType === 'guage') {
                  this.doc.text(`${data[i].value}%`, x, y); // for guage value
                }
              }
            }

            this.doc.addImage(url[(i * 4)], 10, 105, 80, 90);
            this.doc.text(data[(i * 4)].chartName, 10, 105);
            return { isPageHalf: true, Y: 180, present: true };

          case 2:

            if (firstPage = false) {
              let x: number = 42, y: number = 145;
              for (let i = 0; i < data.length; i++) {
                if (data[i].chartType == 'guage') {
                  this.doc.text(`${data[i].value}%`, x, y); // for guage value
                  x = x + 90;
                }
              }
            }

            if (firstPage = true) {
              let x: number = 45, y: number = 145;
              for (let i = 4; i < data.length; i++) {
                if (data[i].chartType === 'guage') {
                  this.doc.text(`${data[i].value}%`, x, y); // for guage value
                  x = x + 90;
                }
              }
            }

            this.doc.addImage(url[(i * 4)], 10, 105, 80, 90);
            this.doc.text(data[(i * 4)].chartName, 10, 105);

            this.doc.addImage(url[(i * 4) + 1], 100, 105, 80, 90);
            this.doc.text(data[(i * 4) + 1].chartName, 100, 105);
            return { isPageHalf: true, Y: 180, present: true };

          case 3:

            this.doc.addImage(url[(i * 4)], 10, 105, 80, 90);
            this.doc.text(data[(i * 4)].chartName, 10, 105);

            if (data[0].chartType === 'guage') {
              this.doc.text(`${data[(i * 4)].value}%`, 40, 140);// for guage value
            }

            this.doc.addImage(url[(i * 4) + 1], 100, 105, 80, 90);
            this.doc.text(data[(i * 4) + 1].chartName, 100, 105);

            if (data[1].chartType === 'guage') {
              this.doc.text(`${data[(i * 4) + 1].value}%`, 130, 140);// for guage value
            }

            this.doc.addImage(url[(i * 4) + 2], 50, 195, 80, 90);
            this.doc.text(data[(i * 4) + 2].chartName, 50, 195);

            if (data[2].chartType === 'guage') {
              this.doc.text(`${data[(i * 4) + 2].value}%`, 85, 230);// for guage value
            }

            return { isPageHalf: false, Y: 90, present: true };
        }
      }
      i++;
    }
    return { isPageHalf: false, Y: 90, present: true };
  }

  fullChartOnPdf(reportFilter, url, data, name) {

    this.no_of_page = 0;
    if (this.halfInfo.isPageHalf === true) {
      this.doc.addImage(url[0], 10, 180, 200, 90);
      this.doc.text(data[0].chartName, 10, 180);
      url.splice(0, 1);
      data.splice(0, 1);
    }

    let length = data.length;
    this.no_of_page = Math.floor((length / 2));

    if (length % 2 > 0) {
      this.no_of_page = this.no_of_page + 1;
    }
    let i = 0;
    while (i < this.no_of_page) {
      this.doc.setFontSize(15);
      this.doc.setFontStyle('bold');
      this.doc.setTextColor(51, 51, 51);

      if ((this.halfInfo.present === false) && (i === 0)) {
        this.pageAddition(reportFilter);  // For First page
      } else {
        this.doc.addPage();
        this.pageAddition(reportFilter);
      }
      if ((i + 1) * 2 <= length) {
        this.doc.text(data[(i * 2)].chartName, 10, 90);
        this.doc.addImage(url[(i * 2)], 10, 90, 200, 90);
        this.doc.text(data[(i * 2) + 1].chartName, 10, 180);
        this.doc.addImage(url[(i * 2) + 1], 10, 180, 200, 90);

      } else {
        this.doc.text(data[(i * 2)].chartName, 10, 90);
        this.doc.addImage(url[(i * 2)], 10, 90, 200, 90);

        return { isPageHalf: true, Y: 180, present: true };
      }
      i++;
    }
    return { isPageHalf: false, Y: 90, present: true };
  }

  getGuagecoOrdinates(chart, position) {
    if (chart.chartType === 'guage') {
      switch (position) {
        case 0: return [40, 125];
        case 1: return [130, 125];
        case 2: return [42, 207];
        case 3: return [135, 207];
      }
    }
  }

  getChartNames(chart, position) {
    switch (position) {
      case 0: return [20, 90];
      case 1: return [120, 90];
      case 2: return [20, 170];
      case 3: return [120, 170];
    }
  }

  pageAddition(reportFilter) {
    this.pageHeader(reportFilter);
    this.pageFooter();
  }
  pageHeader(data) {
    let x = 10,
      y = 10,
      lineWidth = 0.7,
      vendor,
      address,
      pageHeight = this.doc.internal.pageSize.height,
      width = this.doc.internal.pageSize.width,
      rgb = this.getBrandColor();
    rgb = this.getBrandColor();

    if (this.logo != undefined) {
      this.doc.addImage(this.logo, "png", x, y, 70, 20);
    } else {
      this.doc.addImage(LOGO, "png", x, y, 70, 20);
    }
    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFontStyle('bold');
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


    this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    this.doc.setLineWidth(lineWidth);
    this.doc.line(10, y, width - 10, y);
    this.doc.setFontSize(16);
    this.doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    y += 10;

    this.doc.text(`${data.reportName} Report`, x, y);
    this.doc.setTextColor(51, 51, 51);
    this.doc.setFontSize(13);
    this.doc.setFontStyle('normal');
    this.doc.setTextColor("#901C1C");
    if(data.shift.length>0){ this.doc.text(`SHIFT WISE Report`, x+150, y);}
    else{ this.doc.text(`DATE TIME Report`, x+150, y);}
    this.doc.setTextColor(51, 51, 51);
    this.doc.setFontSize(13);
    this.doc.setFontStyle('normal');
    y += 10;

    this.doc.text('Plant:', x, y);
    this.doc.text(data.plant, x + 30, y);
    this.doc.text('From:', x + 80, y);
    this.doc.text(this.getDateTime(data.from), x + 115, y);
    y += 8;

    this.doc.text('Department:', x, y);
    this.doc.text(data.department, x + 30, y);
    this.doc.text('To:', x + 80, y);
    this.doc.text(this.getDateTime(data.to), x + 115, y);
    y += 8;

    this.doc.text('Assembly:', x, y);
    this.doc.text(data.assembly, x + 30, y);
    this.doc.text('Interval (mins):', x + 80, y);
    this.doc.text(data.interval, x + 115, y);
    y += 8;
    this.doc.text('Machine:', x, y);
    this.doc.text(data.machine, x + 30, y);
    
    if(data.shift.length>0){
        this.doc.text("Shift:", x + 80, y);
        let count = x + 100;
        let comma = ',';
        for (let index in data.shift) {
          if (parseInt(index) == data.shift.length - 1) {
            comma = '.';
          }
          this.doc.text(`${data.shift[index]}${comma}`, count, y);
          count = count + data.shift[index].length * 2.5;
        }
    }
   
   
    y += 5;
    this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    this.doc.setLineWidth(lineWidth);
    this.doc.line(10, y, width - 10, y);
    y += 5;

  }
  pageFooter() {
    let pageHeight = this.doc.internal.pageSize.height
    const totalPagesExp = '{total_pages_count_string}';
    let str = 'Page ' + this.pageCount;
    this.pageCount++;
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontStyle('normal');
    this.doc.text(str, 10, pageHeight - 12);
    this.doc.text(
      'Created on: ' + new Date().toLocaleString(),
      150,
      pageHeight - 12
    );
    this.doc.text(
      'Designed and developed by: Analogic Automation Private Limited',
      55,
      pageHeight - 7
    );

  }
  getTableOptionsSummary(y, reportFilter) {
    this.reportFilter = reportFilter;
    return {
      startY: y,
      margin: { top: 100, left: 75 },
      fillColor: this.getBrandColor(),
      theme: 'grid',
      styles: {
        cellPadding: 2, overflow: 'linebreak', halign: 'center',
        align: 'right'
      },
      columnStyles: {
        1: { columnWidth: 'auto' }
      },
      tableWidth: 'wrap',
      headerStyles: { columnWidth: 'wrap', align: 'center', fillColor: this.getBrandColor() },
      addPageContent: (this.pageContent)
    };
  }
  pageContent = data => {
    if (this.summaryFlag) {
      this.pageAddition(this.reportFilter);
    } else {
      this.summaryFlag = true;
    }
  }
  private getTableOptionsMonitoring(y, reportFilter) {
    this.reportFilter = reportFilter;
    return {
      startY: y,
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
      addPageContent: (this.pageContentMonitoring)
    };
  }
  pageContentMonitoring = data => {
    if (this.monitoringFlag) {
      this.pageAddition(this.reportFilter);
    } else {
      this.monitoringFlag = true;
    }
  }
  private getColumn(title, type, i) {
    let tempTitle;
    switch (type) {
      case 'dynamic':
        tempTitle = title[i];
        if (title == 'headers') tempTitle = 'Summary';
        if (title == 'value') tempTitle = ' ';
        break;
    }
    return tempTitle;
  }
  private getBrandColor = () => [71, 66, 184];
  private getDateTime = date => moment(date).format('MMM D, YYYY h:mm:ss a');

}