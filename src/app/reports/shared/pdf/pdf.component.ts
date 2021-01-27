import { Component, Input, OnInit } from "@angular/core";
import { PdfService } from "./pdf.service";
import { ReportsService } from "../../reports.service";
@Component({
  selector: "report-pdf",
  templateUrl: "./pdf.component.html",
  styleUrls: ["./pdf.component.scss"]
})
export class PdfComponent implements OnInit{
  @Input()
  report: any;

  @Input()
  data: any;

  @Input()
  highlight: any;

  @Input()
  ready: boolean;

  @Input()
  plants: boolean;

  @Input()
  alarmData: any;


  @Input()
  chartarray:any;

 @Input() 
 chartname:any;

 @Input()
 guagevalue:any;

 public headerInformation: any;
 public logo: any;
  
  constructor(private pdf: PdfService,private rs: ReportsService) {
     }
  ngOnInit(){
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
   
    this.pdf.createPdf(
      this.report,
      {
        tableData: this.data,
        tableAlarmData: this.alarmData,
      },
      this.highlight, this.plants,this.chartarray,this.chartname,this.guagevalue,
      headerInformation,logo
      );

  }

  
}