import { Component, OnInit } from "@angular/core";
import { Sesion } from "../Sesion/sesion";
import { Alert } from "../Alerts/Alert";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Routers } from "../ModelosComando/Routers";
import { EigrpModel } from "../Modelos/EigrpModel";
import { RipModel } from "../Modelos/RipModel";

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
  public listaEigrpModel: EigrpModel[] = [];
  public listaEigrpAsignadosModel: EigrpModel[] = [];
  public asn: number = 1;
  public red: string = "";
  public redRip: string = "";
  public listaRipModel: RipModel[] = [];
  public listaRipAsignadosModel: RipModel[] = [];
  public comandosEigrp: string[] = [];
  public comandosRip: string[] = [];

  constructor(public ruta: Router, public formBuilder: FormBuilder) {
    this.formRip = formBuilder.group({});
  }

  ngOnInit() {
    this.listaEigrpModel.push({
      router_eigrp: "10",
      network: "192.168.10.0 0.0.0.255",
    });
    this.listaEigrpModel.push({
      router_eigrp: "10",
      network: "192.168.30.0 0.0.0.255",
    });
    this.listaEigrpModel.push({
      router_eigrp: "10",
      network: "192.168.40.0 0.0.0.255",
    });
    this.listaEigrpAsignadosModel.push({
      router_eigrp: "10",
      network: "192.168.10.0 0.0.0.255",
    });
    this.listaEigrpAsignadosModel.push({
      router_eigrp: "20",
      network: "192.168.50.0 0.0.0.255",
    });
    for (let i = 0; i < this.listaEigrpModel.length; i++) {
      for (let l of this.listaEigrpAsignadosModel) {
        if (this.listaEigrpModel[i].network == l.network) {
          this.listaEigrpModel.splice(i, 1);
        }
      }
    }
    this.listaRipModel.push({
      network: "192.168.10.0",
    });
    this.listaRipModel.push({
      network: "10.10.10.0",
    });
    this.listaRipAsignadosModel.push({
      network: "10.10.20.0",
    });
    this.listaRipAsignadosModel.push({
      network: "10.10.10.0",
    });

    for (let i = 0; i < this.listaRipModel.length; i++) {
      for (let l of this.listaRipAsignadosModel) {
        if (this.listaRipModel[i].network == l.network) {
          this.listaRipModel.splice(i, 1);
        }
      }
    }
    this.checksesion();
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError("¡ No se ha iniciado sesión !");
      this.ruta.navigate([""]);
    }
  }

  enviarDatosEigrp() {
    //let comandos: string[] = [];
    this.comandosEigrp.push(this.routerComand.router_eigrp + this.asn);
    this.comandosEigrp.push(this.routerComand.network + this.red);
    this.comandosEigrp.push(this.routerComand.exit);
    console.log("EIGRP ", this.comandosEigrp);
  }

  enviarDatosRip() {
    //let comandos: string[] = [];
    this.comandosRip.push(this.routerComand.router_rip);
    this.comandosRip.push(this.routerComand.version_rip);
    this.comandosRip.push(this.routerComand.network + this.redRip);
    this.comandosRip.push(this.routerComand.no_auto_summary);
    this.comandosRip.push(this.routerComand.exit);
    console.log("RIP ", this.comandosRip);
  }

  eliminarEnrutamientoEigrp(posicion: number) {
    //let comandos: string[] = [];
    this.comandosEigrp.push(
      this.routerComand.no_router_eigrp +
        this.listaEigrpAsignadosModel[posicion].router_eigrp
    );
    console.log("EIGRP eliminar ", this.comandosEigrp);
  }

  eliminarDatosEigrp(posicion: number) {
    //let comandos: string[] = [];
    this.comandosEigrp.push(
      this.routerComand.router_eigrp +
        this.listaEigrpAsignadosModel[posicion].router_eigrp
    );
    this.comandosEigrp.push(
      this.routerComand.no_network +
        this.listaEigrpAsignadosModel[posicion].network
    );
    this.comandosEigrp.push(this.routerComand.exit);
    console.log("EIGRP eliminar ", this.comandosEigrp);
  }

  eliminarDatosRip(posicion: number) {
    //let comandos: string[] = [];
    this.comandosRip.push(this.routerComand.router_rip);
    this.comandosRip.push(
      this.routerComand.no_network +
        this.listaRipAsignadosModel[posicion].network
    );
    this.comandosRip.push(this.routerComand.exit);
    console.log("RIP eliminar ", this.comandosRip);
  }

  eliminarEnrutamientoRip(posicion: number) {
    //let comandos: string[] = [];
    this.comandosRip.push(this.routerComand.no_router_rip);
    console.log("RIP eliminar ", this.comandosRip);
  }
}
