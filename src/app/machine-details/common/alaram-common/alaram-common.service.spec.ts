import { TestBed, inject } from '@angular/core/testing';

import { AlaramCommonService } from './alaram-common.service';

describe('AlaramCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlaramCommonService]
    });
  });

  it('should be created', inject([AlaramCommonService], (service: AlaramCommonService) => {
    expect(service).toBeTruthy();
  }));
});
