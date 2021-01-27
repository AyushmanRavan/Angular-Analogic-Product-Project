import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirCompressorComponent } from './air-compressor.component';

describe('AirCompressorComponent', () => {
  let component: AirCompressorComponent;
  let fixture: ComponentFixture<AirCompressorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirCompressorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirCompressorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
