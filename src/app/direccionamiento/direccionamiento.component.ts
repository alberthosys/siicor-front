import {Component, OnInit} from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert, alertConfirm} from "../Alerts/Alert";
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {VlanModel} from "../Modelos/VlanModel";
import {Routers} from "../ModelosComando/Routers";
import {group} from "@angular/animations";

@Component({
  selector: 'app-direccionamiento',
  templateUrl: './direccionamiento.component.html',
  styleUrls: ['./direccionamiento.component.css']
})
export class DireccionamientoComponent implements OnInit {
  public sesion = new Sesion();
  public routerComands = new Routers();
  public alerta = new Alert();
  public ventana: boolean = false;
  public globalComands2: string[] = [];
  public globalComands: string[] = [];
  public listCables: string[] = [];
  public listInterfaces: Datos[] = [];
  public listSubInterfaces: string[] = [];
  public formInterfaces: FormGroup;
  public formSubInterfaces: FormGroup;
  public formEliminarSubInt: FormGroup;
  public showClockRate: boolean = false;
  public showClockRate2: boolean = false;
  public selectCable:string=null;
  constructor(public ruta: Router, public formBuilder: FormBuilder) {
    this.formInterfaces = this.formBuilder.group({
      cableEntrada: [null, Validators.compose([Validators.required, Validators.pattern("^(fa|gig|se)[0-9]/[0-9]$")])],
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
    })
    this.formSubInterfaces = this.formBuilder.group({
      vlan: [null, Validators.compose([Validators.required, Validators.pattern("[0-9]*")])],
      cableEntrada: [null, Validators.compose([Validators.required, Validators.pattern("^(fa|gig|se)[0-9]/[0-9]$")])],
      cableEntrada2: [null, Validators.compose([Validators.required, Validators.pattern("^(fa|gig|se)[0-9]/[0-9]$")])],
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
    })
    this.formEliminarSubInt=formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
    })
  }


  ngOnInit() {
    this.checksesion()
    this.listCables.push("fa0/0");
    this.listCables.push("fa0/1");
    this.listCables.push("fa0/2");
    this.listCables.push("se0/1");
    this.listCables.push("se0/2");
    this.listInterfaces.push({cable: "gig0/0", ip: "192.168.1.2", mask: "255.255.255.0"})
    this.listInterfaces.push({cable: "gig0/1", ip: "192.168.1.3", mask: "255.255.255.0"})
    this.listInterfaces.push({cable: "gig0/2", ip: "192.168.1.4", mask: "255.255.255.0"})
    this.listSubInterfaces.push("gig0/0.1");
    this.listSubInterfaces.push("gig0/2.3");
    this.listSubInterfaces.push("gig0/4.6");
  }

  selecSerial() {
    let cable: string = this.formInterfaces.controls.cableEntrada.value;
    if (cable.includes("se")) {
      this.showClockRate = true;
      this.formInterfaces.addControl('clockrate', new FormControl([null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(64000)])]));
    } else {
      this.showClockRate = false;
      this.formInterfaces.removeControl('clockrate');
    }
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }

  gudardarInterface() {
    let comands: string[] = [];
    if (this.formInterfaces.valid) {
      comands.push(this.routerComands.int + this.formInterfaces.controls.cableEntrada.value);
      comands.push(this.routerComands.ip_address + this.formInterfaces.controls.ipEntrada.value + " " + this.formInterfaces.controls.mask.value);
      if (this.showClockRate2) {
        comands.push(this.routerComands.clock_rate + this.formInterfaces.controls.clockrate.value);
      }
      comands.push(this.routerComands.no_shutdown);
      comands.push(this.routerComands.exit);
    } else {
      this.alerta.alertError("Revisa que todos los campos se hayan llenado correctamente")
    }
    console.log(comands)
    comands.forEach((comand) => {
      this.globalComands.push(comand);
    })
  }

  eliminarInterface(interfaces: Datos) {
    alertConfirm.fire({html:"Esta seguro que desea eliminar la red Ip de esta subinterface"}).then((response)=>{
      if(response.value){
        let comands: string[] = [];
        comands.push(this.routerComands.int + interfaces.cable);
        comands.push("no " + this.routerComands.ip_address + interfaces.ip + " " + interfaces.mask);
        comands.push(this.routerComands.exit);
        comands.forEach((comand) => {
          this.globalComands.push(comand)
        })
        this.alerta.alertSuccess("Se ha eliminado exitosamente !")
      }
    });
  }

  gudardarSubInterface() {
    let comands: string[] = [];
    if (this.formSubInterfaces.valid) {
      let cable2: string = this.formSubInterfaces.controls.cableEntrada2.value.toString();
      cable2=cable2.substring(cable2.length - 1, cable2.length);
      comands.push(this.routerComands.int + this.formSubInterfaces.controls.cableEntrada.value + "." + cable2);
      comands.push(this.routerComands.encapsulation_dot1q+this.formSubInterfaces.controls.vlan.value)
      comands.push(this.routerComands.ip_address + this.formSubInterfaces.controls.ipEntrada.value + " " + this.formSubInterfaces.controls.mask.value);
      comands.push(this.routerComands.no_shutdown);
      comands.push(this.routerComands.exit);
    } else {
      this.alerta.alertError("Revisa que todos los campos se hayan llenado correctamente")
    }
    console.log(comands)
    comands.forEach((comand) => {
      this.globalComands2.push(comand);
    })
  }
  eliminarSubInterface(){
    alertConfirm.fire({html:"Esta seguro que desea eliminar la subInterface"}).then((response)=>{
      if(response.value){
        let comands: string[] = [];
        if (this.formEliminarSubInt.valid) {
          comands.push(this.routerComands.int + this.selectCable);
          comands.push("no "+this.routerComands.ip_address + this.formEliminarSubInt.controls.ipEntrada.value + " " + this.formEliminarSubInt.controls.mask.value);
          comands.push(this.routerComands.exit);
          this.alerta.alertSuccess("Se ha eliminado exitosamente !")
        } else {
          this.alerta.alertError("Revisa que todos los campos se hayan llenado correctamente")
        }
        console.log(comands)
        comands.forEach((comand) => {
          this.globalComands2.push(comand);
        })
      }
    });
  }
}

class Datos {
  cable: string;
  ip: string;
  mask: string;
}


