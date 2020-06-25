import { Component, OnInit } from "@angular/core";
import { Sesion } from "../Sesion/sesion";
import { Alert, alertConfirm } from "../Alerts/Alert";
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
  public radioButton: boolean = true;
  public radioButtonModo: boolean = true;
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
      vlanNumero: [null,Validators.compose([Validators.required, Validators.pattern("[0-9]*")]),],
      vlanNombre: [null,Validators.compose([Validators.required,Validators.pattern("[a-zA-Z0-9_-]*"),]),],});
    this.formPuertos = formBuildder.group({
      vlanNumero: [null,Validators.compose([Validators.required, Validators.pattern("[0-9]*")])],
      vlanRangoUno: [null,Validators.compose([Validators.required,Validators.pattern("^fa[0-9]/[0-9]*$"),]),],
      vlanRangoDos: [null,Validators.compose([Validators.required,Validators.pattern("^fa[0-9]/[0-9]*$"),]),],
    });
    this.formRuteo = formBuildder.group({
      vlanNumero: [null,Validators.compose([Validators.required, Validators.pattern("[0-9]*")])],
      vlanIp: [null, Validators.compose([Validators.required, 
        Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      vlanMascara: [null, Validators.compose([Validators.required,
        Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])]
    });
  }

  ngOnInit() {
    this.checksesion();
    this.vlans.push({ vlan_numero: null, vlan_name_string: null });
    this.vlansEditar.push({ vlan_numero: 10, vlan_name_string: "DATIC" });
    this.vlansEditar.push({ vlan_numero: 20, vlan_name_string: "DACEA" });
    this.rangos.push({puerto_rango: "fa0/1",puerto_rangoDos: "fa0/5",puerto_vlan: "10",});
    this.rangos.push({puerto_rango: "fa0/6",puerto_rangoDos: "fa0/10",puerto_vlan: "20",});
    this.rangosTrunk.push({puerto_rango: "fa0/11",puerto_rangoDos: "fa0/13",puerto_vlan: "100",});
    this.ruteoEstablecido.push({vlan_interface: 10,vlan_ip: "192.168.10.1",vlan_mascara: "255.255.255.0",});
    console.log("EDIT->", this.vlansEditar);
  }


  //CREACIÓN DE VLAN Tab 1

  eliminarVlanCreada(pos: number) {
    alertConfirm.fire({html:"Esta seguro que desea eliminar la VLAN "+
     this.vlansEditar[pos].vlan_numero}).then((resolve) =>{
      if(resolve.value){
        this.comandosVlan.push(this.comando.no_vlan + this.vlansEditar[pos].vlan_numero);
        console.log("Eliminar VLAN->", this.comandosVlan);
        // this.ngOnInit();
      }
    })
    
  }

  // Asignar puertos Tab 2

  eliminarPuertoCreado(pos: number) {
    alertConfirm.fire({html:"Esta seguro que desea eliminar los puertos para esta VLAN"}).then((resolve) =>{
      if(resolve.value){
        this.comandosModeAcc.push(this.comando.vlan_rango_uno + this.rangos[pos].puerto_rango +
          "-" + this.rangos[pos].puerto_rangoDos,
        this.comando.no_vlan_mode_acc + this.rangos[pos].puerto_vlan);
        console.log("Eliminar Puertos->", this.comandosModeAcc);
      }
    })
  }

  //Ruteo Tab 3

  eliminarRuteoCreado(pos: number) {
    alertConfirm.fire({html:"Esta seguro que desea eliminar el ruteo para la VLAN "+
     this.ruteoEstablecido[pos].vlan_interface}).then((resolve) =>{
      if(resolve.value){
        this.comandosSvi.push(this.comando.no_ruteo_vlan + this.ruteoEstablecido[pos].vlan_interface);
        console.log("Eliminar Puertos->", this.comandosSvi);
      }
    })
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError("¡ No se ha iniciado sesión !");
      this.ruta.navigate([""]);
    }
  }

  enviarDatosAlBack() {
    if (this.formVLAN.valid) {
      this.comandosVlan.push(this.comando.vlan_number + this.formVLAN.controls.vlanNumero.value);
      this.comandosVlan.push(this.comando.vlan_name + this.formVLAN.controls.vlanNombre.value);
      this.comandosVlan.push(this.comando.exit);
    } else {
      this.alerta.alertError(
        "Revisa que todos los campos se hayan llenado correctamente"
      );
    }
    // vlan 10
    // name SICOR
    // exit
    console.log("ENVIANDO-AL-BACK", this.comandosVlan);
  }

  enviarDatosAlBackPuertos() {
    console.log(this.formPuertos)
    if(this.radioButtonModo== true){
      if (!this.radioButton && this.formPuertos.valid) {
        this.comandosModeAcc.push(
          this.comando.vlan_rango_uno +
            this.formPuertos.controls.vlanRangoUno.value + "-" +
            this.formPuertos.controls.vlanRangoDos.value);
        this.comandosModeAcc.push(this.comando.vlan_rango_mode_acc);
        this.comandosModeAcc.push(this.comando.vlan_rango_acc_vlan + this.formPuertos.controls.vlanNumero.value);
        this.comandosModeAcc.push(this.comando.exit);
      }else if(this.radioButton && this.formPuertos.controls.vlanNumero.valid 
        && this.formPuertos.controls.vlanRangoUno.valid){
        this.comandosModeAcc.push(this.comando.vlan_sin_rango +
            this.formPuertos.controls.vlanRangoUno.value);
        this.comandosModeAcc.push(this.comando.vlan_rango_mode_acc);
        this.comandosModeAcc.push(this.comando.vlan_rango_acc_vlan + this.formPuertos.controls.vlanNumero.value);
        this.comandosModeAcc.push(this.comando.exit);
      } else {
        this.alerta.alertError(
          "Revisa que todos los campos se hayan llenado correctamente"
        );
      }
    }else{
      if(!this.radioButton && this.formPuertos.valid){
        this.comandosModeAcc.push(
          this.comando.vlan_rango_uno +
            this.formPuertos.controls.vlanRangoUno.value + "-" +
            this.formPuertos.controls.vlanRangoDos.value
            );
        this.comandosModeAcc.push(this.comando.vlan_rango_mode_trunk);
        this.comandosModeAcc.push(this.comando.vlan_rango_trunk_native + this.formPuertos.controls.vlanNumero.value);
        this.comandosModeAcc.push(this.comando.exit);
      }else if(this.radioButton && this.formPuertos.controls.vlanNumero.valid 
        && this.formPuertos.controls.vlanRangoUno.valid){
        this.comandosModeAcc.push(this.comando.vlan_sin_rango +
            this.formPuertos.controls.vlanRangoUno.value);
        this.comandosModeAcc.push(this.comando.vlan_rango_mode_trunk);
        this.comandosModeAcc.push(this.comando.vlan_rango_trunk_native + this.formPuertos.controls.vlanNumero.value);
        this.comandosModeAcc.push(this.comando.exit);
      }else {
        this.alerta.alertError(
          "Revisa que todos los campos se hayan llenado correctamente"
        );
      }
    }
    console.log("ENVIANDO-AL-BACK", this.comandosModeAcc);
  }

  enviarDatosAlBackSvi() {
    if (this.formRuteo.valid) {
      this.comandosSvi.push(this.comando.vlan_ruteo_vlan + this.formRuteo.controls.vlanNumero.value);
      this.comandosSvi.push(this.comando.vlan_ruteo_ip + this.formRuteo.controls.vlanIp.value 
        + " " + this.formRuteo.controls.vlanMascara.value);
      this.comandosSvi.push(this.comando.exit);
    } else {
      this.alerta.alertError(
        "Revisa que todos los campos se hayan llenado correctamente"
      );
    }

    console.log("ENVIANDO-AL-BACK", this.comandosSvi);
  }
}
