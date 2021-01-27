import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsDialogComponent } from './shifts-dialog.component';

describe('ShiftsDialogComponent', () => {
  let component: ShiftsDialogComponent;
  let fixture: ComponentFixture<ShiftsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
