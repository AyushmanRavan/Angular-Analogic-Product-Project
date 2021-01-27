import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamViewAddComponent } from './param-view-add.component';

describe('ParamViewAddComponent', () => {
  let component: ParamViewAddComponent;
  let fixture: ComponentFixture<ParamViewAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamViewAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamViewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
