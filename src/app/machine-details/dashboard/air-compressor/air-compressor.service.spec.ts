import { TestBed, inject } from '@angular/core/testing';

import { AirCompressorService } from './air-compressor.service';

describe('AirCompressorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirCompressorService]
    });
  });

  it('should be created', inject([AirCompressorService], (service: AirCompressorService) => {
    expect(service).toBeTruthy();
  }));
});
