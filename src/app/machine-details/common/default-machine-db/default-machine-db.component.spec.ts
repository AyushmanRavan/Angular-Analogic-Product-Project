import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMachineDbComponent } from './default-machine-db.component';

describe('DefaultMachineDbComponent', () => {
  let component: DefaultMachineDbComponent;
  let fixture: ComponentFixture<DefaultMachineDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultMachineDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultMachineDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
