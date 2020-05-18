import { Component, OnInit } from "@angular/core";
import { Sesion } from "../Sesion/sesion";
import { Alert } from "../Alerts/Alert";
import { Routers } from "../Modelos/Routers";
import { Switch } from "../Modelos/Switch";
import { Router } from "@angular/router";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-vlan",
  templateUrl: "./vlan.component.html",
  styleUrls: ["./vlan.component.css"],
})
export class VlanComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public routerComand = new Routers();
  public switchComand = new Switch();
  public ventana: number = 1;
  public cantidadVlan: number = 0;
  public formNumeroVlans: FormGroup;
  public formCrearVlan: FormGroup;
  public formAsignarPuertos: FormGroup;
  public formTrunk: FormGroup;
  public formRuteo: FormGroup;
  public i = Array;
  public vlans: Vlans[] = [{ vlan_number: null, name_name: null }];

  constructor(public ruta: Router, public formBuilder: FormBuilder) {
    this.formCrearVlan = formBuilder.group({
      vlan_number: [""],
      name_name: [""],
      exit: [this.switchComand.exit],
    });
    this.formAsignarPuertos = formBuilder.group({});
    this.formNumeroVlans = formBuilder.group({
      cantidad: [1],
    });
  }

  ngOnInit() {
    this.checksesion();
  }

  crearVlan() {
    console.log("VLAN->", this.vlans);
  }
  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError("¡ No se ha iniciado sesión !");
      this.ruta.navigate([""]);
    }
  }
  cargarCantidad() {
    //this.cantidadVlan = this.formNumeroVlans.controls.cantidad.value;
    /*  let vlans = {
      vlan_number: [""],
      name_name: [""],
      exit: [""],
    };
    this.vlans.push(vlans);
    console.log(this.vlans);*/
  }
  submit() {
    console.log(this.formCrearVlan);
  }
}

class Vlans {
  vlan_number: number;
  name_name: string;
}
