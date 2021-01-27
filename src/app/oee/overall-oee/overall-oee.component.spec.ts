import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallOeeComponent } from './overall-oee.component';

describe('OverallOeeComponent', () => {
  let component: OverallOeeComponent;
  let fixture: ComponentFixture<OverallOeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallOeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallOeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
