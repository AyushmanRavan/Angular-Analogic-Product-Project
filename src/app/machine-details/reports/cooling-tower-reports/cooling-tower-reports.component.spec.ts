import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolingTowerReportsComponent } from './cooling-tower-reports.component';

describe('CoolingTowerReportsComponent', () => {
  let component: CoolingTowerReportsComponent;
  let fixture: ComponentFixture<CoolingTowerReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolingTowerReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolingTowerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
