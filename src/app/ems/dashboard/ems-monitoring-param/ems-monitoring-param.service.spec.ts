import { TestBed, inject } from '@angular/core/testing';

import { EmsMonitoringParamService } from './ems-monitoring-param.service';

describe('EmsMonitoringParamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmsMonitoringParamService]
    });
  });

  it('should be created', inject([EmsMonitoringParamService], (service: EmsMonitoringParamService) => {
    expect(service).toBeTruthy();
  }));
});
