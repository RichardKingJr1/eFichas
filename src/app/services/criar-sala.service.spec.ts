import { TestBed } from '@angular/core/testing';

import { CriarSalaService } from './criar-sala.service';

describe('CriarSalaService', () => {
  let service: CriarSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriarSalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
