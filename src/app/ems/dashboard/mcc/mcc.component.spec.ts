import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccComponent } from './mcc.component';

describe('MccComponent', () => {
  let component: MccComponent;
  let fixture: ComponentFixture<MccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
