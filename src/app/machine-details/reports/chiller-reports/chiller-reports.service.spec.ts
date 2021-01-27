import { TestBed, inject } from '@angular/core/testing';

import { ChillerReportsService } from './chiller-reports.service';

describe('ChillerReportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChillerReportsService]
    });
  });

  it('should be created', inject([ChillerReportsService], (service: ChillerReportsService) => {
    expect(service).toBeTruthy();
  }));
});
