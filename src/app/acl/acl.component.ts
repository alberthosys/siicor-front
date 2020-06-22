import {Component, OnInit} from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Routers} from "../ModelosComando/Routers";

@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.css']
})
export class AclComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public comandos = new Routers();
  public ventana: boolean = false;
  public formAclEstandar: FormGroup;
  public formAclExtendida: FormGroup;
  public in_out: boolean = false;
  public listClables: string[] = [];
  public globalComands: string[] = [];
  public listACLlist: string[] = []

  constructor(
    public ruta: Router,
    public formBuilder: FormBuilder
  ) {
    this.formAclEstandar = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      group: [null, Validators.compose([Validators.required,Validators.pattern('[0-9]*'),Validators.min(100)])],
      cableEntrada: [null, Validators.compose([Validators.required,Validators.pattern("^(fa|gig)[0-9]/[0-9]$")])]
    });
    this.formAclExtendida = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      mask:[null],
      ipDestino: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      group: [null, Validators.compose([Validators.required,Validators.pattern('[0-9]*'),Validators.min(100)])],

    });
  }

  ngOnInit() {
    this.checksesion();
    this.listClables.push("fa0/0");
    this.listClables.push("fa0/1");
    this.listClables.push("fa0/2");
    this.listACLlist.push("access-list 3 deny host 1.1.1.1");
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }

  guardar() {
    let listComands: string[] = [];
    if (this.formAclEstandar.valid) {
      listComands.push(this.comandos.access_list + this.formAclEstandar.controls.group.value + this.comandos.deny_host + this.formAclEstandar.controls.ipEntrada.value);
      listComands.push(this.comandos.access_list + this.formAclEstandar.controls.group.value + this.comandos.permit_any);
      listComands.push(this.comandos.int + this.formAclEstandar.controls.cableEntrada.value);
      listComands.push(this.comandos.ip_acess_group + this.formAclEstandar.controls.group.value + " " + (this.in_out ? "out" : "in"));
      listComands.push(this.comandos.exit)
    } else {
      this.alerta.alertError("Revisa que todos los campos se hayan llenado correctamente")
      //Validaciones
    }
    listComands.forEach((save) => {
      this.globalComands.push(save);
    })
    console.log("Comands->", listComands)
  }
  eliminar(acl:string){
    let comand:string="no "+acl;
    console.log("ELiminar->"+comand)
    this.globalComands.push(comand)
  }

}
