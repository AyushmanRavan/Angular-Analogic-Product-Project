import { TestBed, inject } from '@angular/core/testing';

import { AirCompressorReportsService } from './air-compressor-reports.service';

describe('AirCompressorReportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirCompressorReportsService]
    });
  });

  it('should be created', inject([AirCompressorReportsService], (service: AirCompressorReportsService) => {
    expect(service).toBeTruthy();
  }));
});
