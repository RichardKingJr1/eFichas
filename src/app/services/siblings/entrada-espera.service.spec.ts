import { TestBed } from '@angular/core/testing';

import { EntradaEsperaService } from './entrada-espera.service';

describe('EntradaEsperaService', () => {
  let service: EntradaEsperaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaEsperaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
