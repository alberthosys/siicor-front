import { Component, OnInit } from "@angular/core";
import { Sesion } from "../Sesion/sesion";
import { Alert } from "../Alerts/Alert";
import { Router } from "@angular/router";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VlanModel } from "../Modelos/VlanModel";
import { PuertoModel } from "../Modelos/PuertoModel";
import { VlanTrunkModel } from "../Modelos/VlanTrunkModel";
import { VlanRuteoModel } from "../Modelos/VlanRuteoModel";

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
  public puertos: PuertoModel[] = [];
  public formPuertos: FormGroup;
  public puertosTrunk: VlanTrunkModel[] = [];
  public formPuertosTrunk: FormGroup;
  public ruteo: VlanRuteoModel[] = [];
  public formRuteo: FormGroup;
  public ventana: number = 1;

  lista: string[] = ["10", "20", "40"];

  constructor(public ruta: Router, public formBuildder: FormBuilder) {
    this.formVLAN = formBuildder.group({
      numero: [0],
    });
    this.formPuertos = formBuildder.group({
      numero: [0],
    });
    this.formPuertosTrunk = formBuildder.group({
      numero: [0],
    });
    this.formRuteo = formBuildder.group({
      numero: [0],
    });
  }

  ngOnInit() {
    this.checksesion();
  }
  // Creación de VLAN
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
  // Asignar puertos
  agregarPuerto() {
    for (let i = 0; i < this.formPuertos.controls.numero.value; i++) {
      this.puertos.push({
        puerto_rango: null,
        puerto_rangoDos: null,
        puerto_vlan: null,
      });
    }
  }

  eliminarPuerto(posicion: number) {
    let puertoTemp: PuertoModel[] = [];
    this.puertos.forEach((item, index) => {
      if (index != posicion) {
        puertoTemp.push(item);
      }
    });
    this.puertos = puertoTemp;
  }
  // Puertos Trunk
  agregarPuertosTrunk() {
    for (let i = 0; i < this.formPuertosTrunk.controls.numero.value; i++) {
      this.puertosTrunk.push({
        vlan_trunk_rango: null,
        vlan_trunk_rangoDos: null,
        vlan_trunk: null,
      });
    }
  }

  eliminarPuertosTrunk(posicion: number) {
    let trunkTemp: VlanTrunkModel[] = [];
    this.puertosTrunk.forEach((item, index) => {
      if (index != posicion) {
        trunkTemp.push(item);
      }
    });
    this.puertosTrunk = trunkTemp;
  }
  //Ruteo
  agregarRuteo() {
    for (let i = 0; i < this.formRuteo.controls.numero.value; i++) {
      this.ruteo.push({
        vlan_interface: null,
        vlan_ip: null,
        vlan_mascara: null,
      });
    }
  }

  eliminarRuteo(posicion: number) {
    let ruteoTemp: VlanRuteoModel[] = [];
    this.ruteo.forEach((item, index) => {
      if (index != posicion) {
        ruteoTemp.push(item);
      }
    });
    this.ruteo = ruteoTemp;
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
