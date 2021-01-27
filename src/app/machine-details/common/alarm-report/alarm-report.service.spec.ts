import { TestBed, inject } from '@angular/core/testing';

import { AlarmReportService } from './alarm-report.service';

describe('AlarmReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlarmReportService]
    });
  });

  it('should be created', inject([AlarmReportService], (service: AlarmReportService) => {
    expect(service).toBeTruthy();
  }));
});
