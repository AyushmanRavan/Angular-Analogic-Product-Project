import { TestBed, inject } from '@angular/core/testing';

import { PccService } from './pcc.service';

describe('PccService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PccService]
    });
  });

  it('should be created', inject([PccService], (service: PccService) => {
    expect(service).toBeTruthy();
  }));
});
