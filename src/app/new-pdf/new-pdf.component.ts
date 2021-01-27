import { Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, AfterContentChecked, ViewChild } from '@angular/core';
import { PDF_CONSTANT } from './pdf-config';
// import { PlantDetailsComponent } from './plant-details/plant-details.component'
@Component({
  selector: 'app-new-pdf',
  templateUrl: './new-pdf.component.html',
  styleUrls: ['./new-pdf.component.scss']
})
export class NewPdfComponent implements OnInit, AfterViewInit {
  pdfIsDownloaded = false;
  public paperSize;
  public reportLandscap;
  public fileName;
  public PDF_CONSTANT = PDF_CONSTANT;
  public date = new Date();
  public formattedDate = this.date.toLocaleDateString();
  public hours = this.date.getHours();
  public minutes: any = this.date.getMinutes();
  public ampm = this.hours >= 12 ? 'PM' : 'AM';
  public strTime;
  public pdfData;

  @ViewChild('pdf') pdf;
  @ViewChild('downloadBtn') downloadBtn;
  constructor() { 
    this.hours = this.hours % 12;
    this.hours = this.hours ? this.hours : 12;
    this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    this.strTime = this.hours + ':' + this.minutes + ' ' + this.ampm;
  }

  ngOnInit() {
    // this.paperSize = this.PDF_CONSTANT.PDF_PAPER_SIZE;
  }

  getPdfData(pdfData) {
    this.pdfData = pdfData;
    this.paperSize = pdfData.reportPaperSize;
    this.pdf.author = this.PDF_CONSTANT.PDF_HEADER;
    this.pdf.creator = this.PDF_CONSTANT.PDF_HEADER;
    this.pdf.repeatHeaders = 'true';
    this.fileName = pdfData.reportFileName;
    this.reportLandscap = pdfData.reportLandscap;
    this.downloadPDF();
  }

  downloadPDF() {
    // this.pdf.title = 'testfromnewCOmp';
    // this.pdf.paperSize = 'A4';
    this.pdf.margin = '1cm';
    this.pdf.repeatHeaders = 'true';
    this.pdf.landscape = this.reportLandscap;
    // this.downloadBtn.nativeElement.click();
    //   setTimeout(() =>  {
    //     this.pdf.saveAs(this.pdfData.reportFileName + '.pdf');
    //  }, 10000);
  }
  
  ngAfterViewInit() {
    // this.downloadBtn.nativeElement.click();
    this.pdf.saveAs(this.pdfData.reportFileName + '.pdf');
    // this.pdfIsDownloaded = true;

  }
  // ngAfterContentInit() {
  // }
  // ngAfterContentChecked() {
  // }
  // ngAfterViewChecked(){
  // }
}
