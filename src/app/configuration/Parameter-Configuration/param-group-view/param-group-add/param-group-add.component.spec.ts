import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamGroupAddComponent } from './param-group-add.component';

describe('ParamGroupAddComponent', () => {
  let component: ParamGroupAddComponent;
  let fixture: ComponentFixture<ParamGroupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamGroupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
