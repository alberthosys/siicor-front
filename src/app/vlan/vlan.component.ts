import { Component, OnInit } from "@angular/core";
import { Sesion } from "../Sesion/sesion";
import { Alert } from "../Alerts/Alert";
import { Router } from "@angular/router";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VlanModel } from "../Modelos/VlanModel";
import { PuertoModel } from "../Modelos/PuertoModel";
import { VlanTrunkModel } from "../Modelos/VlanTrunkModel";
import { VlanRuteoModel } from "../Modelos/VlanRuteoModel";
import { Switch } from "../ModelosComando/Switch";

@Component({
  selector: "app-vlan",
  templateUrl: "./vlan.component.html",
  styleUrls: ["./vlan.component.css"],
})
export class VlanComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  //VLAN
  public vlans: VlanModel[] = [];
  public vlansEditar: VlanModel[] = [];
  public formVLAN: FormGroup;
  //Asignar puertos
  public rangos: PuertoModel[] = [];
  public puertos: PuertoModel[] = [];
  public formPuertos: FormGroup;
  //puertos trunk
  public rangosTrunk: PuertoModel[] = [];
  public puertosTrunk: VlanTrunkModel[] = [];
  public formPuertosTrunk: FormGroup;
  //ruteo SVI
  public ruteo: VlanRuteoModel[] = [];
  public ruteoEstablecido: VlanRuteoModel[] = [];
  public formRuteo: FormGroup;
  //Comandos globales
  public comandosVlan: string[] = [];
  public comandosModeAcc: string[] = [];
  public comandosModeTrunk: string[] = [];
  public comandosSvi: string[] = [];

  public ventana: number = 1;
  public comando = new Switch();

  lista: string[] = ["10", "20", "40"];
  lista_puerto: string[] = [
    "fa0/1",
    "fa0/2",
    "fa0/3",
    "fa0/4",
    "fa0/5",
    "fa0/6",
    "fa0/7",
    "fa0/8",
    "fa0/9",
    "fa0/10",
  ];

  constructor(public ruta: Router, public formBuildder: FormBuilder) {
    this.formVLAN = formBuildder.group({
      vlanNumero: [
        null,
        Validators.compose([Validators.required, Validators.pattern("[0-9]*")]),
      ],
      vlanNombre: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern("[a-zA-Z0-9_-]*"),
        ]),
      ],
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
    //Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")
  }

  ngOnInit() {
    this.checksesion();
    this.vlans.push({ vlan_numero: null, vlan_name_string: null });
    this.vlansEditar.push({ vlan_numero: 10, vlan_name_string: "DATIC" });
    this.vlansEditar.push({ vlan_numero: 20, vlan_name_string: "DACEA" });
    this.rangos.push({
      puerto_rango: "fa0/1",
      puerto_rangoDos: "fa0/5",
      puerto_vlan: "10",
    });
    this.rangos.push({
      puerto_rango: "fa0/6",
      puerto_rangoDos: "fa0/10",
      puerto_vlan: "20",
    });
    this.rangosTrunk.push({
      puerto_rango: "fa0/11",
      puerto_rangoDos: "fa0/13",
      puerto_vlan: "100",
    });
    this.ruteoEstablecido.push({
      vlan_interface: 10,
      vlan_ip: "192.168.10.1",
      vlan_mascara: "255.255.255.0",
    });
    console.log("EDIT->", this.vlansEditar);
  }

  // Creación de VLAN
  // agregarVLAN() {
  //   for (let i = 0; i < this.formVLAN.controls.numero.value; i++) {
  //     this.vlans.push({ vlan_numero: null, vlan_name_string: null });
  //   }
  // }
  agregarVLAN() {
    this.vlans.push({ vlan_numero: null, vlan_name_string: null });
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

  eliminarVlanCreada(pos: number) {
    this.comandosVlan.push(
      this.comando.no_vlan + this.vlansEditar[pos].vlan_numero
    );
    console.log("Eliminar VLAN->", this.comandosVlan);
    // this.ngOnInit();
  }

  editarVlan(pos: number) {
    let comandos: string[] = [];
    comandos.push(this.comando.vlan_number + this.vlansEditar[pos].vlan_numero);
    comandos.push(
      this.comando.vlan_name + this.vlansEditar[pos].vlan_name_string
    );
    console.log("Editar VLAN->", comandos);
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

  eliminarPuertoCreado(pos: number) {
    this.comandosModeAcc.push(
      this.comando.vlan_rango_uno +
        this.rangos[pos].puerto_rango +
        "-" +
        this.rangos[pos].puerto_rangoDos,
      this.comando.no_vlan_mode_acc + this.rangos[pos].puerto_vlan
    );
    console.log("Eliminar Puertos->", this.comandosModeAcc);
  }

  editarPuerto(pos: number) {
    this.comandosModeAcc.push(
      this.comando.vlan_rango_uno +
        this.rangos[pos].puerto_rango +
        "-" +
        this.rangos[pos].puerto_rangoDos
    );
    this.comandosModeAcc.push(this.comando.vlan_rango_mode_acc);
    this.comandosModeAcc.push(
      this.comando.vlan_rango_acc_vlan + this.rangos[pos].puerto_vlan
    );
    console.log("Editar VLAN->", this.comandosModeAcc);
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

  eliminarPuertoTrunkCreado(pos: number) {
    this.comandosModeTrunk.push(
      this.comando.vlan_rango_uno +
        this.rangos[pos].puerto_rango +
        "-" +
        this.rangos[pos].puerto_rangoDos,
      this.comando.no_vlan_mode_trunk + this.rangos[pos].puerto_vlan
    );
    console.log("Eliminar Puertos->", this.comandosModeTrunk);
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

  eliminarRuteoCreado(pos: number) {
    this.comandosSvi.push(
      this.comando.no_ruteo_vlan + this.ruteoEstablecido[pos].vlan_interface
    );
    console.log("Eliminar Puertos->", this.comandosSvi);
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError("¡ No se ha iniciado sesión !");
      this.ruta.navigate([""]);
    }
  }

  enviarDatosAlBack() {
    if (this.formVLAN.valid) {
      this.comandosVlan.push(
        this.comando.vlan_number + this.formVLAN.controls.vlanNumero.value
      );
      this.comandosVlan.push(
        this.comando.vlan_name + this.formVLAN.controls.vlanNombre.value
      );
      this.comandosVlan.push(this.comando.exit);
    }

    // vlan 10
    // name SICOR
    // exit
    console.log("ENVIANDO-AL-BACK", this.comandosVlan);
  }

  enviarDatosAlBackPuertos() {
    this.puertos.forEach((item) => {
      this.comandosModeAcc.push(
        this.comando.vlan_rango_uno +
          item.puerto_rango +
          "-" +
          item.puerto_rangoDos
      );
      this.comandosModeAcc.push(this.comando.vlan_rango_mode_acc);
      this.comandosModeAcc.push(
        this.comando.vlan_rango_acc_vlan + item.puerto_vlan
      );
      this.comandosModeAcc.push(this.comando.exit);
    });
    console.log("ENVIANDO-AL-BACK", this.comandosModeAcc);
  }

  enviarDatosAlBackTrunk() {
    this.puertosTrunk.forEach((item) => {
      this.comandosModeTrunk.push(
        this.comando.vlan_rango_uno +
          item.vlan_trunk_rango +
          "-" +
          item.vlan_trunk_rangoDos
      );
      this.comandosModeTrunk.push(this.comando.vlan_rango_mode_trunk);
      this.comandosModeTrunk.push(
        this.comando.vlan_rango_trunk_native + item.vlan_trunk
      );
      this.comandosModeTrunk.push(this.comando.exit);
    });
    console.log("ENVIANDO-AL-BACK", this.comandosModeTrunk);
  }

  enviarDatosAlBackSvi() {
    this.ruteo.forEach((item) => {
      this.comandosSvi.push(this.comando.vlan_ruteo_vlan + item.vlan_interface);
      this.comandosSvi.push(
        this.comando.vlan_ruteo_ip + item.vlan_ip + " " + item.vlan_mascara
      );
      this.comandosSvi.push(this.comando.exit);
    });
    console.log("ENVIANDO-AL-BACK", this.comandosSvi);
  }
}
