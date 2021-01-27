import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedMachineComponent } from './associated-machine.component';

describe('AssociatedMachineComponent', () => {
  let component: AssociatedMachineComponent;
  let fixture: ComponentFixture<AssociatedMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
