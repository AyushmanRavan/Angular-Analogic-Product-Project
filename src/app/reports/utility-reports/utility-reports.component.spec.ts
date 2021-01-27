import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityReportsComponent } from './utility-reports.component';

describe('UtilityReportsComponent', () => {
  let component: UtilityReportsComponent;
  let fixture: ComponentFixture<UtilityReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilityReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
