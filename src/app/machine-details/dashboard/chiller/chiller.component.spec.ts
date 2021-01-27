import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChillerComponent } from './chiller.component';

describe('ChillerComponent', () => {
  let component: ChillerComponent;
  let fixture: ComponentFixture<ChillerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChillerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
