import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantToPlantComparisonComponent } from './plant-to-plant-comparison.component';

describe('PlantToPlantComparisonComponent', () => {
  let component: PlantToPlantComparisonComponent;
  let fixture: ComponentFixture<PlantToPlantComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantToPlantComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantToPlantComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
