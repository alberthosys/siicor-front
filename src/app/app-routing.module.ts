import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConfiguracionComponent} from "./configuracion/configuracion.component";

const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },{
    path:'home',
    component:HomeComponent
  },{
  path:'configuracion',
    component:ConfiguracionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,
  ]
})
export class AppRoutingModule { }
export const routingComponents=[
  HomeComponent,
  ConfiguracionComponent]
