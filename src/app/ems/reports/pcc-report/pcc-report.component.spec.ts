import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PccReportComponent } from './pcc-report.component';

describe('PccReportComponent', () => {
  let component: PccReportComponent;
  let fixture: ComponentFixture<PccReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PccReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PccReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
