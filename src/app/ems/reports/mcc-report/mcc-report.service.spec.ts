import { TestBed, inject } from '@angular/core/testing';

import { MccReportService } from './mcc-report.service';

describe('MccReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MccReportService]
    });
  });

  it('should be created', inject([MccReportService], (service: MccReportService) => {
    expect(service).toBeTruthy();
  }));
});
