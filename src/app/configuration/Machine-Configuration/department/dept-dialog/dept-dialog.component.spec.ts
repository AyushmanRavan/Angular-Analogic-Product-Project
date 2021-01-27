import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptDialogComponent } from './dept-dialog.component';

describe('DeptDialogComponent', () => {
  let component: DeptDialogComponent;
  let fixture: ComponentFixture<DeptDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
