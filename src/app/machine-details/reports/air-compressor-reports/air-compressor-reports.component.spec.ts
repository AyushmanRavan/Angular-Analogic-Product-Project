import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirCompressorReportsComponent } from './air-compressor-reports.component';

describe('AirCompressorReportsComponent', () => {
  let component: AirCompressorReportsComponent;
  let fixture: ComponentFixture<AirCompressorReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirCompressorReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirCompressorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
