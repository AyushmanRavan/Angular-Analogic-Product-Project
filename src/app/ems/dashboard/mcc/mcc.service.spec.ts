import { TestBed, inject } from '@angular/core/testing';

import { MccService } from './mcc.service';

describe('MccService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MccService]
    });
  });

  it('should be created', inject([MccService], (service: MccService) => {
    expect(service).toBeTruthy();
  }));
});
