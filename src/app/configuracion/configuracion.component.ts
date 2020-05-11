import {Component, OnInit} from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";
import {Router} from "@angular/router";

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();

  constructor(public ruta:Router) {
  }

  ngOnInit() {
    this.checksesion()

  }

  checksesion() {
    if (this.sesion.getSesion()) {
      this.alerta.alertSuccess('¡ Bienvenido al sistema S I C O R !')
    } else {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
    this.ruta.navigate([''])
    }
  }

}
