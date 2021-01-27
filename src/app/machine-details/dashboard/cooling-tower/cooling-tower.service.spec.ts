import { TestBed, inject } from '@angular/core/testing';

import { CoolingTowerService } from './cooling-tower.service';

describe('CoolingTowerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoolingTowerService]
    });
  });

  it('should be created', inject([CoolingTowerService], (service: CoolingTowerService) => {
    expect(service).toBeTruthy();
  }));
});
