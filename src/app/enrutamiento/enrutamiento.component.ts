import { Component, OnInit } from "@angular/core";
import { Sesion } from "../Sesion/sesion";
import { Alert } from "../Alerts/Alert";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Routers } from "../ModelosComando/Routers";
import { EigrpModel } from "../Modelos/EigrpModel";

@Component({
  selector: "app-enrutamiento",
  templateUrl: "./enrutamiento.component.html",
  styleUrls: ["./enrutamiento.component.css"],
})
export class EnrutamientoComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public routerComand = new Routers();
  public ventana: boolean = false;
  public formRip: FormGroup;
  public eigrpModel: EigrpModel[] = [];
  public listaEigrpModel: EigrpModel[] = [];
  public asn: number = 0;

  constructor(public ruta: Router, public formBuilder: FormBuilder) {
    this.formRip = formBuilder.group({});
  }

  ngOnInit() {
    this.listaEigrpModel.push({
      network: "192.168.10.1 0.0.0.255",
    });
    this.listaEigrpModel.push({
      network: "192.168.30.1 0.0.0.255",
    });
    this.checksesion();
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError("¡ No se ha iniciado sesión !");
      this.ruta.navigate([""]);
    }
  }

  enviarDatos() {
    let comandos: string[] = [];
    comandos.push(this.routerComand.router_eigrp + this.asn);
    this.listaEigrpModel.forEach((item) => {
      comandos.push(this.routerComand.network + item.network);
    });
    console.log("Comandos a enviar " + comandos);
  }
}
