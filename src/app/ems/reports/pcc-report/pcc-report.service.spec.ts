import { TestBed, inject } from '@angular/core/testing';

import { PccReportService } from './pcc-report.service';

describe('PccReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PccReportService]
    });
  });

  it('should be created', inject([PccReportService], (service: PccReportService) => {
    expect(service).toBeTruthy();
  }));
});
