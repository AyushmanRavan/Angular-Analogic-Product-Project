import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorMonitoringDialogComponent } from './operator-monitoring-dialog.component';

describe('OperatorMonitoringDialogComponent', () => {
  let component: OperatorMonitoringDialogComponent;
  let fixture: ComponentFixture<OperatorMonitoringDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorMonitoringDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorMonitoringDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
