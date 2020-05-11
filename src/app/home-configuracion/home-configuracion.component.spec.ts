import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeConfiguracionComponent } from './home-configuracion.component';

describe('HomeConfiguracionComponent', () => {
  let component: HomeConfiguracionComponent;
  let fixture: ComponentFixture<HomeConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
