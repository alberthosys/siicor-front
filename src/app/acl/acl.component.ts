import {Component, OnInit} from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.css']
})
export class AclComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public ventana: boolean = false;
  public formAclEstandar: FormGroup;
  public formAclExtendida: FormGroup;

  constructor(
    public ruta: Router,
    public formBuilder: FormBuilder
  ) {
    this.formAclEstandar = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required])]
    });
    this.formAclExtendida = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required])],
      ipDestino: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.checksesion()

  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }

}
