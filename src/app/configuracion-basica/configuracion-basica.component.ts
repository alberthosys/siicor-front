import { Component, OnInit } from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";
import {Router} from "@angular/router";
import {Routers} from "../Modelos/Routers";
import {Switch} from "../Modelos/Switch";

@Component({
  selector: 'app-configuracion-basica',
  templateUrl: './configuracion-basica.component.html',
  styleUrls: ['./configuracion-basica.component.css']
})
export class ConfiguracionBasicaComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public routerComand= new Routers();
  public switchComand= new Switch();
  constructor(public ruta:Router) {
  }

  ngOnInit() {
    this.checksesion()
    console.log(this.routerComand.enabled)
    console.log(this.routerComand.config_terminal)
    console.log(this.routerComand.line_console_0)
    console.log(this.routerComand.password+" cisco")
    console.log(this.routerComand.login)
    console.log(this.routerComand.exit)
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }
}
