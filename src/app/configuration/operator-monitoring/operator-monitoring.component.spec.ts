import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorMonitoringComponent } from './operator-monitoring.component';

describe('OperatorMonitoringComponent', () => {
  let component: OperatorMonitoringComponent;
  let fixture: ComponentFixture<OperatorMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
