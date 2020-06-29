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
  public showPasswords: boolean = false;
  public showPasswords2: boolean = false;
  public valMin: number = 0;

  constructor(
    public ruta: Router,
    public formBuilder: FormBuilder
  ) {
    this.formConsole = formBuilder.group({
      enabled: [this.routerComand.enabled],
      config_terminal: [this.routerComand.config_terminal],
      line_console_0: [this.routerComand.line_console_0],
      last_password: [null, Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
      login: [this.routerComand.login],
      exit: [this.routerComand.exit]
    });
    this.formVty = formBuilder.group({
      enabled: [this.routerComand.enabled],
      config_terminal: [this.routerComand.config_terminal],
      line_vty: [this.routerComand.line_vty],
      cero: [false],
      uno: [false],
      dos: [false],
      tres: [false],
      cuatro: [false],
      valorMinimo: [0, Validators.compose([Validators.required, Validators.min(0), Validators.pattern('[0-9]*')])],
      valorMax: [null, Validators.compose([Validators.pattern('[0-9]*')])],
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
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

  actualizarLineConsole() {
    let comands: string[] = [];
    if (this.formConsole.controls.password.value != this.formConsole.controls.confirm_password.value) {
      this.alerta.alertError("Revisa que todos los campos esten correctos!")
      return
    }
    if (this.formConsole.valid) {
      comands.push(this.formConsole.controls.last_password.value);
      comands.push(this.routerComand.enabled);
      comands.push(this.routerComand.config_terminal);
      comands.push(this.routerComand.line_console_0);
      comands.push(this.routerComand.password + this.formConsole.controls.password.value);
      comands.push(this.routerComand.login);
      comands.push(this.routerComand.exit);
    } else {
      this.alerta.alertError("Revisa que todos los campos esten correctos!")
    }

    console.log("comands->", comands)
  }

  actualizarVTY() {
    let comands: string[] = [];
  if(this.formVty.controls.valorMax.value!=null && this.formVty.controls.valorMax.value.trim()==''){
    this.formVty.controls.valorMax.setValue(null);
  }
  if(this.formVty.controls.valorMax.value && this.formVty.controls.valorMinimo.value>=this.formVty.controls.valorMax.value){
    this.alerta.alertError("Revisa que todos los campos esten correctos!")
    return
  }
    if (this.formVty.valid) {
      comands.push(this.routerComand.enabled);
      comands.push(this.routerComand.config_terminal);
      comands.push(this.routerComand.line_vty + (this.formVty.controls.valorMax.value? this.formVty.controls.valorMinimo.value + ' ' + this.formVty.controls.valorMax.value : this.formVty.controls.valorMinimo.value));
      comands.push(this.routerComand.password + this.formConsole.controls.password.value);
      comands.push(this.routerComand.login);
      comands.push(this.routerComand.exit);
    } else {
      this.alerta.alertError("Revisa que todos los campos esten correctos!")
    }
    console.log(comands)
  }

}
