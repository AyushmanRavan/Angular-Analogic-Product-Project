import { TestBed, inject } from '@angular/core/testing';

import { ChillerService } from './chiller.service';

describe('ChillerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChillerService]
    });
  });

  it('should be created', inject([ChillerService], (service: ChillerService) => {
    expect(service).toBeTruthy();
  }));
});
