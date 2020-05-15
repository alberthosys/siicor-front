import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppRoutingModule, routingComponents} from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import { HeaderComponent } from './header/header.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MenuComponent } from './menu/menu.component';
import { HomeConfiguracionComponent } from './home-configuracion/home-configuracion.component';
import { DireccionamientoComponent } from './direccionamiento/direccionamiento.component';
import { EnrutamientoComponent } from './enrutamiento/enrutamiento.component';
import { AclComponent } from './acl/acl.component';
import { VlanComponent } from './vlan/vlan.component';
import { ConfiguracionBasicaComponent } from './configuracion-basica/configuracion-basica.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    ConfiguracionComponent,
    MenuComponent,
    HomeConfiguracionComponent,
    DireccionamientoComponent,
    EnrutamientoComponent,
    AclComponent,
    VlanComponent,
    ConfiguracionBasicaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }