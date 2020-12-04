import { TestBed } from '@angular/core/testing';

import { IntegromatService } from './integromat.service';

describe('IntegromatService', () => {
  let service: IntegromatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegromatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
