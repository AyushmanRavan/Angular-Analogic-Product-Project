import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigFilterFormComponent } from './config-filter-form.component';

describe('ConfigFilterFormComponent', () => {
  let component: ConfigFilterFormComponent;
  let fixture: ComponentFixture<ConfigFilterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigFilterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
