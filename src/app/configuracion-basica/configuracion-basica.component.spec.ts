import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionBasicaComponent } from './configuracion-basica.component';

describe('ConfiguracionBasicaComponent', () => {
  let component: ConfiguracionBasicaComponent;
  let fixture: ComponentFixture<ConfiguracionBasicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionBasicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionBasicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
