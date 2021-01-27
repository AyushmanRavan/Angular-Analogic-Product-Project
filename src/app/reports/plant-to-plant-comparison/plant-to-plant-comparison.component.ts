import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { omit } from 'lodash';
import { ReportsService } from "../reports.service";
import { DATA } from 'src/app/core/data.enum';
import { StorageServiceService } from 'src/app/core/services/auth/storage-service.service';

export interface PeriodicElement {
  plant1: string;
  parameter:string;
  plant2: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {parameter: 'Total Production', plant1: 'Hydrogen', plant2: 1.0079},
  {parameter: 'Total Production Cost', plant1: 'Helium', plant2: 4.0026},
  {parameter: 'Total Energy', plant1: 'Helium', plant2: 4.0026},
  {parameter: 'Total Energy Cost', plant1: 'Helium', plant2: 4.0026}
];


@Component({
  selector: 'app-plant-to-plant-comparison',
  templateUrl: './plant-to-plant-comparison.component.html',
  styleUrls: ['./plant-to-plant-comparison.component.scss']
})
export class PlantToPlantComparisonComponent implements OnInit {
  displayedColumns: string[] = ['parameter', 'plant1', 'plant2'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  PlantToPlant:FormGroup;

  plantOptions1:any[]=[];
  plantOptions2:any[]=[];

  spinerLoaded:boolean=false;
  Errormsg:boolean=false;
  loaded:boolean=true;
  errMessage: string;
  
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;
  plants=[];

  fromStartAt;
  toStartAt;
  max: Date = new Date();
  min: Date = new Date();

  constructor(private fb: FormBuilder,private rs:ReportsService,
    private storageServiceService: StorageServiceService
    )
  {
     this.PlantToPlant = this.fb.group({
     plant1: ['', Validators.required],
     plant2: ['', Validators.required],
      from: [this.rs.getDate(), Validators.required],
      to: ["", Validators.required]
   });
   this.fromStartAt = this.rs.getDate();
    this.toStartAt = this.rs.getDate(true);
  }
  
  setMinToDate() {
    const { from } = this.PlantToPlant.value;
    this.min = from;
  }

 ngOnInit() { 
   this.storageServiceService.saveStorage(DATA.LAST_ACTION, Date.now().toString());
   this.rs.getPlant().subscribe( data =>
     {
           this.plantOptions1 = data;
           this.PlantToPlant.get('plant2').disable();
     },err => this.handleError(err));
 }

 onChangePlant(e,index)
 {
  this.PlantToPlant.get('plant2').enable();
   if(index==1){

    if (this.plantOptions2.length != 0) {
      while (this.plantOptions2.length > 0) {
        this.plantOptions2.pop();
      }
    } 

    this.rs.getPlant().subscribe( data =>
      { 
        if(data!=undefined)
        {
         for(let i=0;i<data.length;i++)
         {
           if(e == data[i].id)
           {}
           else
           this.plantOptions2.push(data[i]);
         }
        }
      });
   }
   else{
    if (this.plantOptions1.length != 0) {
      while (this.plantOptions1.length > 0) {
        this.plantOptions1.pop();
      }
    } 

    this.rs.getPlant().subscribe( data =>
      { 
        if(data!=undefined)
        {
         for(let i=0;i<data.length;i++)
         {
           if(e == data[i].id)
           {}
           else
           this.plantOptions1.push(data[i]);
         }
        }
      });
}

   
 }
 

 onGenerate()
 { 
  this.spinerLoaded=true;
  this.loaded=true;
  this.Errormsg=true;
  this.getPlantTotal(this.PlantToPlant.value);
 }
 
 private getPlantTotal(PlantCompare)
 {
   let plants=[];
   plants.push(PlantCompare.plant1);
   plants.push(PlantCompare.plant2);  
   this.reportVal = { ...PlantCompare, type: "plantComparisonReport" };
   this.rs.getPlantCompareData(plants,PlantCompare.from,PlantCompare.to).subscribe(data=>{
    this.setTableData(data);     
    },err => this.handleError(err));
 } 

 setTableData(data){
  if(data!=null){ 
    if (this.plants.length != 0) {
    while (this.plants.length > 0) {
      this.plants.pop();
    }
  } //empty  
 this.plants.push(data[0].firstPlant);
 this.plants.push(data[0].secondPlant);
 
  this.dataSource=data;
  let  colsToEmit = [
    'firstPlant',
    'secondPlant'
  ];
  data=this.rs.filterMachineDataForComparisionPdf(data,colsToEmit);
  this.pdfData = data;
  this.pdfReady = true;
  this.loaded=false;
  this.spinerLoaded=false;
  this.Errormsg=true;
  }
  else{
  this.loaded=true;
  this.spinerLoaded=false;
  this.Errormsg=false;
  this.errMessage = this.rs.getErrorMessage(1);
 }
}
private handleError(err, id = 0) {
  this.errMessage = this.rs.getErrorMessage(id);
  this.rs.throwError(err);
}


}