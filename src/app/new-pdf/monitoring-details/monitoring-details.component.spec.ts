import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDetailsComponent } from './monitoring-details.component';

describe('MonitoringDetailsComponent', () => {
  let component: MonitoringDetailsComponent;
  let fixture: ComponentFixture<MonitoringDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
