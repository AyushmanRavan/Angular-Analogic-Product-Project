import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlaramCommonComponent } from './alaram-common.component';

describe('AlaramCommonComponent', () => {
  let component: AlaramCommonComponent;
  let fixture: ComponentFixture<AlaramCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlaramCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlaramCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
