import { TestBed, inject } from '@angular/core/testing';

import { OeeService } from './oee.service';

describe('OeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OeeService]
    });
  });

  it('should be created', inject([OeeService], (service: OeeService) => {
    expect(service).toBeTruthy();
  }));
});
