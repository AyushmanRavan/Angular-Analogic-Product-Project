import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineMaintenanceDialogComponent } from './machine-maintenance-dialog.component';

describe('MachineMaintenanceDialogComponent', () => {
  let component: MachineMaintenanceDialogComponent;
  let fixture: ComponentFixture<MachineMaintenanceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
