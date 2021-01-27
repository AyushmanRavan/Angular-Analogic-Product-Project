import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyReportsComponent } from './energy-reports.component';

describe('EnergyReportsComponent', () => {
  let component: EnergyReportsComponent;
  let fixture: ComponentFixture<EnergyReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
