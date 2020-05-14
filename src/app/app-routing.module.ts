import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConfiguracionComponent} from "./configuracion/configuracion.component";
import {DireccionamientoComponent} from "./direccionamiento/direccionamiento.component";
import {EnrutamientoComponent} from "./enrutamiento/enrutamiento.component";
import {AclComponent} from "./acl/acl.component";
import {VlanComponent} from "./vlan/vlan.component";
import {ConfiguracionBasicaComponent} from "./configuracion-basica/configuracion-basica.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }, {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'configuracion',
    component: ConfiguracionComponent
  }, {
    path: 'direccionamiento',
    component: DireccionamientoComponent
  }, {
    path: 'enrutamiento',
    component: EnrutamientoComponent
  }, {
    path: 'acl',
    component: AclComponent
  }, {
    path: 'vlan',
    component: VlanComponent
  }
  , {
    path: 'configuracionBasica',
    component: ConfiguracionBasicaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,
  ]
})
export class AppRoutingModule {
}

export const routingComponents = [
  HomeComponent,
  ConfiguracionComponent,
  DireccionamientoComponent,
  EnrutamientoComponent,
  AclComponent,
  VlanComponent,
  ConfiguracionBasicaComponent
]
