import { TestBed, inject } from '@angular/core/testing';

import { MachineReportService } from './machine-report.service';

describe('MachineReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineReportService]
    });
  });

  it('should be created', inject([MachineReportService], (service: MachineReportService) => {
    expect(service).toBeTruthy();
  }));
});
