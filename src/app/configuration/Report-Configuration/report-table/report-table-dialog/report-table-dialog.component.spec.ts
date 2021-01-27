import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTableDialogComponent } from './report-table-dialog.component';

describe('ReportTableDialogComponent', () => {
  let component: ReportTableDialogComponent;
  let fixture: ComponentFixture<ReportTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
