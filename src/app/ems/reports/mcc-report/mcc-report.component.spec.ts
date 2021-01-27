import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccReportComponent } from './mcc-report.component';

describe('MccReportComponent', () => {
  let component: MccReportComponent;
  let fixture: ComponentFixture<MccReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
