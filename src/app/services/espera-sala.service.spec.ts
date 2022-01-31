import { TestBed } from '@angular/core/testing';

import { EsperaSalaService } from './espera-sala.service';

describe('EsperaSalaService', () => {
  let service: EsperaSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsperaSalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
