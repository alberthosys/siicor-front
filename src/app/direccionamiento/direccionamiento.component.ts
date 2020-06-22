import {Component, OnInit} from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {VlanModel} from "../Modelos/VlanModel";

@Component({
  selector: 'app-direccionamiento',
  templateUrl: './direccionamiento.component.html',
  styleUrls: ['./direccionamiento.component.css']
})
export class DireccionamientoComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public formDireccionamiento: FormGroup;
  public listVlan: VlanModel[] = [];

  constructor(public ruta: Router,
              public formBuilder: FormBuilder) {
    this.formDireccionamiento = formBuilder.group({
      vlanNumero: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      vlanName: null
    })
  }


  ngOnInit() {
    this.checksesion()

  }


  guardarUsuario() {
    console.log("VALIDAR-Formulario->", this.formDireccionamiento.valid)
    if (this.formDireccionamiento.valid) {
      this.listVlan.push({
        vlan_numero: this.formDireccionamiento.controls.vlanNumero.value,
        vlan_name_string: this.formDireccionamiento.controls.vlanName.value
      });
      console.log("FORMULARIO->", this.formDireccionamiento.value);
      this.formDireccionamiento.controls.vlanNumero.setValue(null);
      this.formDireccionamiento.controls.vlanName.setValue(null);
      this.alerta.alertSuccess('Esta validado!');
    } else {
      this.alerta.alertError('No esta validado!');
    }

    /*
   console.log("Valueform->",this.formDireccionamiento.value);
   console.log("vlanNumero->"+this.formDireccionamiento.controls.vlanNumero.value);
   console.log("vlanName->"+this.formDireccionamiento.controls.vlanName.value);
  */
  }

  //vlan numero
  //name nombre
  //exit
  enviarComandos(){
    let listComands:string[]=[];
    this.listVlan.forEach((vlan)=>{
      listComands.push("vlan "+vlan.vlan_numero);
      listComands.push("name "+vlan.vlan_name_string);
      listComands.push("exit");
    });//Aqui termina la iteracion
    console.log("LISTA-Comandos->",listComands);
  }

  //no vlan numero
  //exit
  eliminarVlan(vlan:VlanModel){
    let listComands:string[]=[];
    listComands.push("no vlan "+vlan.vlan_numero);
    listComands.push("exit");
    console.log("ELIMINAR-VLAN->",listComands);
    //-------------------------------------------------
    let listTempVlan:VlanModel[]=[];
    this.listVlan.forEach((item)=>{
      if(!(vlan.vlan_numero==item.vlan_numero && vlan.vlan_name_string===item.vlan_name_string)){
        listTempVlan.push(item);
      }
    });
    this.listVlan=listTempVlan;
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }

}



