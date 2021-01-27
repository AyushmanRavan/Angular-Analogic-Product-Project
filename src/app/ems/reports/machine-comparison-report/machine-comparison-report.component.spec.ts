import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineComparisonReportComponent } from './machine-comparison-report.component';

describe('MachineComparisonReportComponent', () => {
  let component: MachineComparisonReportComponent;
  let fixture: ComponentFixture<MachineComparisonReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineComparisonReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineComparisonReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
