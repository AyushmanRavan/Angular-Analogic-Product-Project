import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  OnDestroy,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { MaterialModule } from "../../material/material.module";
import { SelectionService } from "./selection.service";
import { MachineService } from '../../machine/machine.service';


@Component({
  selector: "selection",
  templateUrl: "./selection.component.html",
  styleUrls: ["./selection.component.scss"],
  providers: [SelectionService]
})
export class SelectionComponent implements OnInit {

  //@Output & EventEmitter is used when you want to pass data from the child to the parent 
  //@Output emits the data using the EventEmitter method to the parent component
  @Output() select = new EventEmitter();
  @Output() specialMachine = new EventEmitter<boolean>();


  //@Input is used to pass data from parent to child
  @Input() dashboardtype: string;
  @Input() routerParamsObj: any;
  @Input() isPageType: String;
  
  errorMsg: string;
  insight: Insight = new Insight();
  plantOptions = [];
  deptOptions = [];
  assemblyOptions = [];
  machineOptions = [];
  pageType = [];
  dbType = "";
   
  constructor(
    private error: GlobalErrorHandler, private selection: SelectionService,
    private snack: MatSnackBar) {
  }

  ngOnInit() {

    if (this.isPageType) {
      this.dbType = "";
      this.selection.getPageType("abc").subscribe(data => {
        this.pageType.length = 0;
        data && data[0] && data.map(row => {
          this.pageType.push(row)
        })
        this.insight.pagetype = data[0].page_type;
        this.dbType = data[0].page_type;
        this.selection.getdafaultfilter(this.insight.pagetype).subscribe(
          data => {
            if (data) {
              this.insight.plant = data['plantId'];
              this.insight.department = data['deptId'];
              this.insight.assembly = data['assemblyId'];
              this.insight.machine = data['id'];
              this.onDefaultValue(this.insight.plant, this.insight.department, this.insight.assembly, this.insight.machine)
            }

          },
          err => this.handleError(err)
        );

      },
        err => this.handleError(err)
      );
    } else {
      this.dbType = this.dashboardtype;
      this.selection.getdafaultfilter(this.dbType).subscribe(
        data => {
          if (data) {
            this.insight.plant = (this.routerParamsObj && this.routerParamsObj.plantID) !== undefined ? this.routerParamsObj.plantID : data['plantId'];
            this.insight.department = (this.routerParamsObj && this.routerParamsObj.departmentID) !== undefined ? this.routerParamsObj.departmentID : data['departmentId'];
            this.insight.assembly = (this.routerParamsObj && this.routerParamsObj.assemblyID)!== undefined ? this.routerParamsObj.assemblyID : data['assemblyId'];
            this.insight.machine = (this.routerParamsObj && this.routerParamsObj.machineID )!== undefined ? this.routerParamsObj.machineID : data['machineId'];

            // this.insight.plant = data['plantId'];
            // this.insight.department = data['deptId'];
            // this.insight.assembly = data['assemblyId'];
            // if (this.routerParamsObj.machineID !== undefined) {
            //   this.insight.machine = this.routerParamsObj.machineID;
            // } else {
            //   this.insight.machine = data['id'];
            // }
            this.onDefaultValue(this.insight.plant, this.insight.department, this.insight.assembly, this.insight.machine);
          }
        },
        err => this.handleError(err)
      );
    }
  }
  
  onChangePageType(value) {
    this.dbType = value;
    this.selection.getdafaultfilter(this.dbType).subscribe(
      data => {
        if (data) {
          this.insight.plant = data['plantId'];
          this.insight.department = data['deptId'];
          this.insight.assembly = data['assemblyId'];
          this.insight.machine = data['id'];
          this.onDefaultValue(this.insight.plant, this.insight.department, this.insight.assembly, this.insight.machine)
        }
      },
      err => this.handleError(err)
    );
  }
  
  onDefaultValue(plant, department, assembly, machine) {
    this.selection.getPlant().subscribe(data => {
      if (data != null) {
        this.plantOptions = data;
        this.insight.plant = plant;
      } else {
        this.plantOptions = null;
        this.snack.open('No plants', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));


    this.selection.getDept(plant).subscribe((data: any[]) => {
      if (data != null) {
        this.deptOptions = data;
        this.insight.department = department;
      }
      else {
        this.deptOptions = null;
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.snack.open('This Plant does not have Departments', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));


    this.selection.getAssembly(department).subscribe((data: any[]) => {
      if (data != null) {
        this.assemblyOptions = data;
        this.insight.assembly = assembly;
      }
      else {
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.snack.open('This Department does not have Assemblyes', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));

    this.selection.getMachineNames(plant, department, assembly, this.dbType)
      .subscribe(data => {
        if (data != null) {
          this.machineOptions = data;
          this.insight.machine = machine;
          this.getInsights(machine, this.dbType, plant, department, assembly);
        }
        else {
          this.machineOptions = null;
          this.snack.open('This Assembly does not have Machines', 'ok', {
            duration: 5000
          });
        }
      }, err => this.handleError(err));

  }



  /************************end of process *******************/
  onChange(plantID: number) {
    this.insight.department = -0;
    this.insight.assembly = -0;
    this.insight.machine = -0;
    this.insight.plant = plantID;
    this.selection.getDept(plantID).subscribe((data: any[]) => {
      if (data != null) {
        this.deptOptions = data;
      }
      else {
        this.deptOptions = null;
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.snack.open('This Plant does not have Departments', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }

  onChangeDepartment(departmentID: number) {
    this.insight.assembly = -0;
    this.insight.machine = -0;
    this.insight.department = departmentID;
    this.selection.getAssembly(departmentID).subscribe((data: any[]) => {
      if (data != null) {
        this.assemblyOptions = data;
      }
      else {
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.snack.open('This Department does not have Assemblyes', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }

  onChangeAssembly(assemblyID: number) {
    this.insight.machine = -0;
    this.insight.assembly = assemblyID;
    this.selection.getMachineNames(this.insight.plant, this.insight.department, this.insight.assembly, this.dbType)
      .subscribe(data => {
        if (data != null) {
          this.machineOptions = data;
        }
        else {
          this.machineOptions = null;
          this.snack.open('This Assembly does not have Machines', 'ok', {
            duration: 5000
          });
        }
      }, err => this.handleError(err));
  }

  onSelectMachine(machineID: number) {
    this.getInsights(machineID, '', this.insight.plant, this.insight.department, this.insight.assembly);
  }

  getInsights(machineID: number, dbType: string, plantID, departmentID, assemblyID) {
    this.select.emit({  machineID, dbType, plantID, departmentID, assemblyID });
  }
 
  private handleError(err) {
    this.error.handleError(err);
  }

}
class Insight {
  plant: number;
  department: number;
  assembly: number;
  machine: number;
  pagetype: string;
}

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  declarations: [SelectionComponent],
  exports: [SelectionComponent]
})
export class SelectionModule { }

