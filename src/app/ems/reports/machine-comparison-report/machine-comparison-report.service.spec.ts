import { TestBed, inject } from '@angular/core/testing';

import { MachineComparisonReportService } from './machine-comparison-report.service';

describe('MachineComparisonReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineComparisonReportService]
    });
  });

  it('should be created', inject([MachineComparisonReportService], (service: MachineComparisonReportService) => {
    expect(service).toBeTruthy();
  }));
});
