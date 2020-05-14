import { Component, OnInit } from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";
import {Router} from "@angular/router";

@Component({
  selector: 'app-direccionamiento',
  templateUrl: './direccionamiento.component.html',
  styleUrls: ['./direccionamiento.component.css']
})
export class DireccionamientoComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();

  constructor(public ruta:Router) {
  }

  ngOnInit() {
    this.checksesion()

  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }

}
