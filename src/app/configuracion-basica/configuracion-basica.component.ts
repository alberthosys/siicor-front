import {Component, OnInit} from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";
import {Router} from "@angular/router";
import {Routers} from "../ModelosComando/Routers";
import {Switch} from "../ModelosComando/Switch";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-configuracion-basica',
  templateUrl: './configuracion-basica.component.html',
  styleUrls: ['./configuracion-basica.component.css']
})
export class ConfiguracionBasicaComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public routerComand = new Routers();
  public switchComand = new Switch();
  public ventana: boolean = false;
  public formConsole: FormGroup;
  public formVty: FormGroup;

  constructor(
    public ruta: Router,
    public formBuilder: FormBuilder
  ) {
    this.formConsole = formBuilder.group({
      enabled: [this.routerComand.enabled],
      config_terminal: [this.routerComand.config_terminal],
      line_console_0: [this.routerComand.line_console_0],
      password: [null, Validators.compose([Validators.required])],
      login: [this.routerComand.login],
      exit: [this.routerComand.exit],
    })
    this.formVty = formBuilder.group({
      enabled: [this.routerComand.enabled],
      config_terminal: [this.routerComand.config_terminal],
      line_vty:[this.routerComand.line_vty],
      cero: [false],
      uno: [false],
      dos: [false],
      tres: [false],
      cuatro: [false],
      password: [null, Validators.compose([Validators.required])],
      login: [this.routerComand.login],
      exit: [this.routerComand.exit],
    })
  }


  ngOnInit() {
    this.checksesion()
    console.log(this.routerComand.enabled)
    console.log(this.routerComand.config_terminal)
    console.log(this.routerComand.line_console_0)
    console.log(this.routerComand.password + " cisco")
    console.log(this.routerComand.login)
    console.log(this.routerComand.exit)
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }
}
