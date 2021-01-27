import { TestBed, inject } from '@angular/core/testing';

import { CoolingTowerReportsService } from './cooling-tower-reports.service';

describe('CoolingTowerReportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoolingTowerReportsService]
    });
  });

  it('should be created', inject([CoolingTowerReportsService], (service: CoolingTowerReportsService) => {
    expect(service).toBeTruthy();
  }));
});
