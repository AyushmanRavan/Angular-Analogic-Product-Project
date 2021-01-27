import { TestBed, inject } from '@angular/core/testing';

import { BoilerReportsService } from './boiler-reports.service';

describe('BoilerReportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoilerReportsService]
    });
  });

  it('should be created', inject([BoilerReportsService], (service: BoilerReportsService) => {
    expect(service).toBeTruthy();
  }));
});
