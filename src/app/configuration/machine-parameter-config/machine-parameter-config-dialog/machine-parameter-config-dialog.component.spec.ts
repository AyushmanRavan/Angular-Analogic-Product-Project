import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineParameterConfigDialogComponent } from './machine-parameter-config-dialog.component';

describe('MachineParameterConfigDialogComponent', () => {
  let component: MachineParameterConfigDialogComponent;
  let fixture: ComponentFixture<MachineParameterConfigDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineParameterConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineParameterConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
