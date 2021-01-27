import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeederReportComponent } from './feeder-report.component';

describe('FeederReportComponent', () => {
  let component: FeederReportComponent;
  let fixture: ComponentFixture<FeederReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeederReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeederReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
