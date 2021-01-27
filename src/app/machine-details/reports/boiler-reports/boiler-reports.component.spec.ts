import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoilerReportsComponent } from './boiler-reports.component';

describe('BoilerReportsComponent', () => {
  let component: BoilerReportsComponent;
  let fixture: ComponentFixture<BoilerReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoilerReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoilerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
