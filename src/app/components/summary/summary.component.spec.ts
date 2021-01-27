import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryHighlightComponent } from './summary-highlight.component';

describe('SummaryHighlightComponent', () => {
  let component: SummaryHighlightComponent;
  let fixture: ComponentFixture<SummaryHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
