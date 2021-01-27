import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyDialogComponent } from './assembly-dialog.component';

describe('AssemblyDialogComponent', () => {
  let component: AssemblyDialogComponent;
  let fixture: ComponentFixture<AssemblyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
