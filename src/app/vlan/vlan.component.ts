import { Component, OnInit } from "@angular/core";
import { Sesion } from "../Sesion/sesion";
import { Alert } from "../Alerts/Alert";
import { Router } from "@angular/router";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VlanModel } from "../Modelos/VlanModel";

@Component({
  selector: "app-vlan",
  templateUrl: "./vlan.component.html",
  styleUrls: ["./vlan.component.css"],
})
export class VlanComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public vlans: VlanModel[] = [];
  public formVLAN: FormGroup;
  public ventana: number = 1;
  constructor(public ruta: Router, public formBuildder: FormBuilder) {
    this.formVLAN = formBuildder.group({
      numero: [0],
    });
  }

  ngOnInit() {
    this.checksesion();
  }

  agregarVLAN() {
    for (let i = 0; i < this.formVLAN.controls.numero.value; i++) {
      this.vlans.push({ vlan_numero: null, vlan_name_string: null });
    }
  }

  eliminarVlan(pos: number) {
    let vlanTemp: VlanModel[] = [];
    this.vlans.forEach((item, index) => {
      if (index != pos) {
        vlanTemp.push(item);
      }
    });
    this.vlans = vlanTemp;
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError("¡ No se ha iniciado sesión !");
      this.ruta.navigate([""]);
    }
  }

  enviarDatosAlBack() {
    console.log(this.vlans);
  }
}
