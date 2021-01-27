import { Component, Input } from '@angular/core';
import { NewPdfService } from './new-pdf.service';
import { ReportsService } from "../../reports.service";
@Component({
  selector: 'app-new-pdf',
  templateUrl: './new-pdf.component.html',
  styleUrls: ['./new-pdf.component.scss']
})
export class NewPdfComponent {
  @Input()
  ready: boolean;

  @Input()
  report: any;


  @Input()
  chartdata: any;

  @Input()
  chartdataurls: any;

  @Input()
  summarydata: any;

  @Input()
  highlight: any;

  @Input()
  monitoringdata: any;  //  monitoring table

  @Input()
  monitoringHeaders: any;   //headers for monitoring
  public headerInformation: any;
  public logo: any;
  constructor(private pdf: NewPdfService,private rs: ReportsService) {
    this.rs.getHeader().subscribe(data => {
      if (data != null) {
      this.headerInformation = data[0];
      this.rs.getLogoImage(data[0].logo).subscribe((image:Blob) => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          this.logo = reader.result;
         }, false);
        if (image) {
          reader.readAsDataURL(image);
        }
      });
    }
  });   // PDF CONFIGURATION HEADER  
  }

  onSave(type: string,headerInformation,logo) {

    this.pdf.createPdf(this.report, this.chartdata, this.chartdataurls, this.highlight, this.summarydata,this.monitoringHeaders,this.monitoringdata,headerInformation,logo);

  }
}