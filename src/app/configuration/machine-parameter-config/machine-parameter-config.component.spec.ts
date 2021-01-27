import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineParameterConfigComponent } from './machine-parameter-config.component';

describe('MachineParameterConfigComponent', () => {
  let component: MachineParameterConfigComponent;
  let fixture: ComponentFixture<MachineParameterConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineParameterConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineParameterConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
