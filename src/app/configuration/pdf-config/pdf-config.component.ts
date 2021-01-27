import { Component,ViewChild } from '@angular/core';
import { MatPaginator,MatDialog, MatTableDataSource,MatPaginatorIntl } from '@angular/material';
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
import {PdfDialogComponent} from './pdf-dialog/pdf-dialog.component';
declare var jsPDF: any;

@Component({
  selector: 'app-pdf-config',
  templateUrl: './pdf-config.component.html',
  styleUrls: ['../configstyle.scss']
})
export class PdfConfigComponent{
  validToAdd:boolean=true;
  doc: any; 
  pageCount: number=1;
  actionMode: string;
  dataSource = new MatTableDataSource<any>();
  dialogRef;
  displayedColumns = [
    'companyName',
    'companyAddress',
    'logo',
    'actions'
  ];
  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;

  datasetLength:number;

  currentPage = 0;
  pageSize = 10;
  array: any; 


  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private _intl:MatPaginatorIntl,public dialog: MatDialog, private config: ConfigurationService) {
    this.getDefaultSet(10,1);
  }

  ngAfterViewInit() {
    this._intl.itemsPerPageLabel="Record per Page";
    this.dataSource.paginator = this.paginator;
 }

getDefaultSet(limit,offset){
  this.subscriber = this.config.getPDFDetails().subscribe(
    data => {
     
      if(data == null)
      {
        this.handleErrorOFNoMoreData();
        this.hiddenData = true;
     }
      else
      {
        this.setTableData(data);
        this.loaded = true;
        this.hiddenData = false;
        this.errhidden = true;
     }
    },
    err => this.handleError(err)
  );

}

downloadViewLogo(url){
  var imageName = url.substring(url.indexOf('config/pdf/') + 11);
  this.config.downloadViewLogo(imageName).subscribe(  
  data => {
    // console.log("URL",data);   
  },err => this.handleError(err));
}

addPdf(mode = 'add') {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, {});
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  update(row, mode) {
      this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(PdfDialogComponent, {
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
      this.subscriber = this.config.getPDFDetails().subscribe(
        data => {
          if(data==null){ 
            this.paginator.pageIndex=0;
            this.getDefaultSet(0,0);
          }
          else{
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
     this.validToAdd=true;
     this.dataSource=new MatTableDataSource<any>(data);
     this.dataSource.paginator = this.paginator;
     this.array = data;
     this.datasetLength = this.array.length;
     this.iterator();
   } else {
    this.validToAdd=false;
    this.errMessage = this.config.getErrorMessage(1);
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
    this.validToAdd=false;
    this.hiddenData = true;
    this.errhidden=false;
    this.errMessage = this.config.getErrorMessage(1);

  }

  private reset() {
    this.loaded = true;
  }



//View PDF
  showPDF(element){
    this.doc = new jsPDF();
    let x = 10,
    y = 10,
    lineWidth = 0.7,
    vendor =element.companyName,
    address = element.companyAddress,
    pageHeight = this.doc.internal.pageSize.height,
    width = this.doc.internal.pageSize.width,
    rgb = [71, 66, 184];
    rgb =[71, 66, 184];
    this.doc.addImage(element.logo, "png", x, y, 70, 20);
  
  y += 10;
  this.doc.setFontSize(15);
  this.doc.setFontStyle("bold");
  this.doc.setTextColor(51, 51, 51);
  this.doc.text(vendor, x + 100, y);
  y += 5;
   this.doc.text(address, x + 100, y);
  y += 10;
  
  
  this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  this.doc.setLineWidth(lineWidth);
  this.doc.line(10, y, width - 10, y);
  this.doc.setFontSize(16);
  this.doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  y += 10;
  
  this.doc.text(`Report`, x, y);
  this.doc.setTextColor(51, 51, 51);
  this.doc.setFontSize(13);
  this.doc.setFontStyle("normal");
  y += 10;
  
  this.doc.text("Plant:", x, y);
  
  this.doc.text("From:", x + 80, y);
  
  y += 8;
  
  this.doc.text("Department:", x, y);
  
  this.doc.text("To:", x + 80, y);
  
  y += 8;
  
  this.doc.text("Assembly:", x, y);
  
  this.doc.text("Interval (mins):", x + 80, y);
  y += 8;
  this.doc.text("Machine:", x, y);
  
  y += 5;
  this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  this.doc.setLineWidth(lineWidth);
  this.doc.line(10, y, width - 10, y);
  y += 5;
  let summarydata=[{
    'start-time':' 1/24/2019, 3:07:02',
    'end-time':' 1/24/2019, 3:07:02',
    'count':'1'
  },
  {
    'start-time':' 1/25/2019, 3:07:02',
    'end-time':' 1/25/2019, 3:07:02',
    'count':'2'
  },
  {
    'start-time':' 1/26/2019, 3:07:02',
    'end-time':' 1/26/2019, 3:07:02',
    'count':'3'
  }];
  let summaryCols = Object.keys(summarydata[0] || []),
  summaryColumns = [];
  summaryCols.forEach(col => {
  summaryColumns.push({
    title: col ,
    dataKey: col
   });
  });
  
  this.doc.autoTable(summaryColumns, summarydata,this.getTableOptionsSummary(90));
  this.pageFooter();
  this.doc.output('save', 'filename.pdf');
  }
  pageFooter() {
    let pageHeight = this.doc.internal.pageSize.height
    const totalPagesExp = "{total_pages_count_string}";
    let str = "Page " + this.pageCount;
    this.pageCount++;
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
  getTableOptionsSummary(y) {
      return {
      startY: y,
      margin: { top: 100, left: 75 },
      fillColor: [71, 66, 184],
      theme: 'grid',
      styles: {
        cellPadding: 2, overflow: 'linebreak', halign: 'center',
        align: 'right'
      },
      columnStyles: {
        1: { columnWidth: 'auto' }
      },
      tableWidth: 'wrap',
      headerStyles: { columnWidth: 'wrap', align: 'center', fillColor: [71, 66, 184] }    
    };
  }
}

