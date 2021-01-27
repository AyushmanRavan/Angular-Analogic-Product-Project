import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineMaintenanceComponent } from './machine-maintenance.component';

describe('MachineMaintenanceComponent', () => {
  let component: MachineMaintenanceComponent;
  let fixture: ComponentFixture<MachineMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
