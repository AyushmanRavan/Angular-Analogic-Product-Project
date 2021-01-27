import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsMonitoringParamComponent } from './ems-monitoring-param.component';

describe('EmsMonitoringParamComponent', () => {
  let component: EmsMonitoringParamComponent;
  let fixture: ComponentFixture<EmsMonitoringParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmsMonitoringParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmsMonitoringParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
