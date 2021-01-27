import { TestBed, inject } from '@angular/core/testing';

import { FeederService } from './feeder.service';

describe('FeederService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeederService]
    });
  });

  it('should be created', inject([FeederService], (service: FeederService) => {
    expect(service).toBeTruthy();
  }));
});
