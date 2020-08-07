import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule, routingComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './header/header.component';
import {ConfiguracionComponent} from './configuracion/configuracion.component';
import {MenuComponent} from './menu/menu.component';
import {HomeConfiguracionComponent} from './home-configuracion/home-configuracion.component';
import {DireccionamientoComponent} from './direccionamiento/direccionamiento.component';
import {EnrutamientoComponent} from './enrutamiento/enrutamiento.component';
import {AclComponent} from './acl/acl.component';
import {VlanComponent} from './vlan/vlan.component';
import {ConfiguracionBasicaComponent} from './configuracion-basica/configuracion-basica.component';
import {NotFoundComponent} from './not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
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
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
