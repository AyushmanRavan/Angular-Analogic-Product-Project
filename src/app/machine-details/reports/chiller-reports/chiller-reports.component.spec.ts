import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChillerReportsComponent } from './chiller-reports.component';

describe('ChillerReportsComponent', () => {
  let component: ChillerReportsComponent;
  let fixture: ComponentFixture<ChillerReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChillerReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChillerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
