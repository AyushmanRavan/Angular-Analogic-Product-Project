import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamGroupViewComponent } from './param-group-view.component';

describe('ParamGroupViewComponent', () => {
  let component: ParamGroupViewComponent;
  let fixture: ComponentFixture<ParamGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
