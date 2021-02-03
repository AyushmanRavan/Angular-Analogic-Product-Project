import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalErrorHandler } from 'src/app/core/services/error-handler';
import { SelectionService } from './selection.service';

class Insight {
  plant: number;
  department: number;
  assembly: number;
  machine: number;
  pagetype: string;
}

@Component({
  selector: 'selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
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
    private globalErrorHandler: GlobalErrorHandler, private selectionService: SelectionService,
    private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {

    if (this.isPageType) {
      this.dbType = "";
      this.selectionService.getPageType("abc").subscribe(data => {
        this.pageType.length = 0;
        data && data[0] && data.map(row => {
          this.pageType.push(row)
        })
        this.insight.pagetype = data[0].page_type;
        this.dbType = data[0].page_type;
        this.selectionService.getdafaultfilter(this.insight.pagetype).subscribe(
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
      this.selectionService.getdafaultfilter(this.dbType).subscribe(
        data => {
          if (data) {
            this.insight.plant = (this.routerParamsObj && this.routerParamsObj.plantID) !== undefined ? this.routerParamsObj.plantID : data['plantId'];
            this.insight.department = (this.routerParamsObj && this.routerParamsObj.departmentID) !== undefined ? this.routerParamsObj.departmentID : data['departmentId'];
            this.insight.assembly = (this.routerParamsObj && this.routerParamsObj.assemblyID) !== undefined ? this.routerParamsObj.assemblyID : data['assemblyId'];
            this.insight.machine = (this.routerParamsObj && this.routerParamsObj.machineID) !== undefined ? this.routerParamsObj.machineID : data['machineId'];

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
    this.selectionService.getdafaultfilter(this.dbType).subscribe(
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
    this.selectionService.getPlant().subscribe(data => {
      if (data != null) {
        this.plantOptions = data;
        this.insight.plant = plant;
      } else {
        this.plantOptions = null;
        this.matSnackBar.open('No plants', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));


    this.selectionService.getDept(plant).subscribe((data: any[]) => {
      if (data != null) {
        this.deptOptions = data;
        this.insight.department = department;
      }
      else {
        this.deptOptions = null;
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.matSnackBar.open('This Plant does not have Departments', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));


    this.selectionService.getAssembly(department).subscribe((data: any[]) => {
      if (data != null) {
        this.assemblyOptions = data;
        this.insight.assembly = assembly;
      }
      else {
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.matSnackBar.open('This Department does not have Assemblyes', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));

    this.selectionService.getMachineNames(plant, department, assembly, this.dbType)
      .subscribe(data => {
        if (data != null) {
          this.machineOptions = data;
          this.insight.machine = machine;
          this.getInsights(machine, this.dbType, plant, department, assembly);
        }
        else {
          this.machineOptions = null;
          this.matSnackBar.open('This Assembly does not have Machines', 'ok', {
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
    this.selectionService.getDept(plantID).subscribe((data: any[]) => {
      if (data != null) {
        this.deptOptions = data;
      }
      else {
        this.deptOptions = null;
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.matSnackBar.open('This Plant does not have Departments', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }

  onChangeDepartment(departmentID: number) {
    this.insight.assembly = -0;
    this.insight.machine = -0;
    this.insight.department = departmentID;
    this.selectionService.getAssembly(departmentID).subscribe((data: any[]) => {
      if (data != null) {
        this.assemblyOptions = data;
      }
      else {
        this.assemblyOptions = null;
        this.machineOptions = null;
        this.matSnackBar.open('This Department does not have Assemblyes', 'ok', {
          duration: 5000
        });
      }
    }, err => this.handleError(err));
  }

  onChangeAssembly(assemblyID: number) {
    this.insight.machine = -0;
    this.insight.assembly = assemblyID;
    this.selectionService.getMachineNames(this.insight.plant, this.insight.department, this.insight.assembly, this.dbType)
      .subscribe(data => {
        if (data != null) {
          this.machineOptions = data;
        }
        else {
          this.machineOptions = null;
          this.matSnackBar.open('This Assembly does not have Machines', 'ok', {
            duration: 5000
          });
        }
      }, err => this.handleError(err));
  }

  onSelectMachine(machineID: number) {
    this.getInsights(machineID, '', this.insight.plant, this.insight.department, this.insight.assembly);
  }

  getInsights(machineID: number, dbType: string, plantID, departmentID, assemblyID) {
    this.select.emit({ machineID, dbType, plantID, departmentID, assemblyID });
  }

  private handleError(err) {
    this.globalErrorHandler.handleError(err);
  }

}
