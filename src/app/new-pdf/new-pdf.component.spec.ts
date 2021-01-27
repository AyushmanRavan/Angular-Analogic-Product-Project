import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPdfComponent } from './new-pdf.component';

describe('NewPdfComponent', () => {
  let component: NewPdfComponent;
  let fixture: ComponentFixture<NewPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
