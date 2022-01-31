import { TestBed } from '@angular/core/testing';

import { EntrarSalaService } from './entrar-sala.service';

describe('EntrarSalaService', () => {
  let service: EntrarSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntrarSalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
