import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsperaComponent } from './espera.component';

describe('EsperaComponent', () => {
  let component: EsperaComponent;
  let fixture: ComponentFixture<EsperaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsperaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
