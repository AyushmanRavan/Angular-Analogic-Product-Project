import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDialogComponent } from './plant-dialog.component';

describe('PlantDialogComponent', () => {
  let component: PlantDialogComponent;
  let fixture: ComponentFixture<PlantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
