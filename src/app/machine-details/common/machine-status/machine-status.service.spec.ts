import { TestBed, inject } from '@angular/core/testing';

import { MachineStatusService } from './machine-status.service';

describe('MachineStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineStatusService]
    });
  });

  it('should be created', inject([MachineStatusService], (service: MachineStatusService) => {
    expect(service).toBeTruthy();
  }));
});
