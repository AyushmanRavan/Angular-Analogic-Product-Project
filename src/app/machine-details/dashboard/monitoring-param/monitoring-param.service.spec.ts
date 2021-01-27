import { TestBed, inject } from '@angular/core/testing';

import { MonitoringParamService } from './monitoring-param.service';

describe('MonitoringParamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonitoringParamService]
    });
  });

  it('should be created', inject([MonitoringParamService], (service: MonitoringParamService) => {
    expect(service).toBeTruthy();
  }));
});
