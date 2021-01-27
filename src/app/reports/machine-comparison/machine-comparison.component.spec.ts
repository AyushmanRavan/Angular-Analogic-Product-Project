import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineComparisonComponent } from './machine-comparison.component';

describe('MachineComparisonComponent', () => {
  let component: MachineComparisonComponent;
  let fixture: ComponentFixture<MachineComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
