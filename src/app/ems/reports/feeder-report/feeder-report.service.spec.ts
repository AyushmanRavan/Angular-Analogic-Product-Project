import { TestBed, inject } from '@angular/core/testing';

import { FeederReportService } from './feeder-report.service';

describe('FeederReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeederReportService]
    });
  });

  it('should be created', inject([FeederReportService], (service: FeederReportService) => {
    expect(service).toBeTruthy();
  }));
});
