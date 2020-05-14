import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrutamientoComponent } from './enrutamiento.component';

describe('EnrutamientoComponent', () => {
  let component: EnrutamientoComponent;
  let fixture: ComponentFixture<EnrutamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrutamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrutamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
