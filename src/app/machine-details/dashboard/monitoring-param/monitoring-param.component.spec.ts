import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringParamComponent } from './monitoring-param.component';

describe('MonitoringParamComponent', () => {
  let component: MonitoringParamComponent;
  let fixture: ComponentFixture<MonitoringParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
