import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedMachineDialogComponent } from './associated-machine-dialog.component';

describe('AssociatedMachineDialogComponent', () => {
  let component: AssociatedMachineDialogComponent;
  let fixture: ComponentFixture<AssociatedMachineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedMachineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedMachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
