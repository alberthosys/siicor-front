import {Component, OnInit} from '@angular/core';
import {Sesion} from '../Sesion/sesion';
import {Alert} from '../Alerts/Alert';
import {Router} from '@angular/router';
import {Routers} from '../ModelosComando/Routers';
import {Switch} from '../ModelosComando/Switch';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {URLServer} from '../URL/URLServer';
import {SendComandsService} from '../services/send-comands.service';

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
    public formBuilder: FormBuilder,
    public api: SendComandsService
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
    });
  }

  public clear() {
    this.formConsole.controls.last_password.setValue(null);
    this.formConsole.controls.password.setValue(null);
    this.formConsole.controls.confirm_password.setValue(null);
    this.formVty.controls.valorMinimo.setValue(null);
    this.formVty.controls.valorMax.setValue(null);
    this.formVty.controls.password.setValue(null);
    this.formVty.controls.confirm_password.setValue(null);
  }


  ngOnInit() {
    this.checksesion();
    console.log(this.routerComand.enabled);
    console.log(this.routerComand.config_terminal);
    console.log(this.routerComand.line_console_0);
    console.log(this.routerComand.password + ' cisco');
    console.log(this.routerComand.login);
    console.log(this.routerComand.exit);
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !');
      this.ruta.navigate(['']);
    }
  }

  actualizarLineConsole() {
    let comands: string[] = [];
    if (this.formConsole.controls.password.value != this.formConsole.controls.confirm_password.value) {
      this.alerta.alertError('Revisa que todos los campos esten correctos!');
      return;
    }
    let info: any = JSON.parse(atob(localStorage.getItem('localip')));
    alert(this.formConsole.controls.password.value);

    if (this.formConsole.valid && this.formConsole.controls.last_password.value === info.clave) {
      comands.push(this.routerComand.line_console_0);
      comands.push(this.routerComand.password + this.formConsole.controls.password.value);
      comands.push(this.routerComand.login);
      comands.push(this.routerComand.exit);
      let sendComands = '';
      comands.forEach((cmd) => {
        sendComands += cmd + ',';
      });
      sendComands = sendComands.substring(0, sendComands.length - 1);
      // this.api.consultar(URLServer.envioDatos, sendComands).subscribe((response) => {
      //   console.log('change-console', response);
      // });
      // this.ngOnInit();
    } else {
      this.alerta.alertError('Revisa que todos los campos esten correctos!');
    }
    this.clear();
  }

  actualizarVTY() {

    let comands: string[] = [];
    if (this.formVty.controls.valorMax.value != null && this.formVty.controls.valorMax.value.trim() == '') {
      this.formVty.controls.valorMax.setValue(null);
    }
    if (this.formVty.controls.valorMax.value && this.formVty.controls.valorMinimo.value >= this.formVty.controls.valorMax.value) {
      this.alerta.alertError('Revisa que todos los campos esten correctos!');
      return;
    }
    if (this.formVty.valid) {
      comands.push(this.routerComand.line_vty + (this.formVty.controls.valorMax.value ? this.formVty.controls.valorMinimo.value + ' ' + this.formVty.controls.valorMax.value : this.formVty.controls.valorMinimo.value));
      comands.push(this.routerComand.password + this.formVty.controls.password.value);
      comands.push(this.routerComand.login);
      comands.push(this.routerComand.exit);
      let sendComands = '';
      comands.forEach((cmd) => {
        sendComands += cmd + ',';
      });
      sendComands = sendComands.substring(0, sendComands.length - 1);
      this.api.consultar(URLServer.envioDatos, sendComands).subscribe((response) => {
        console.log('change-console', response);
      });
      this.ngOnInit();
    } else {
      this.alerta.alertError('Revisa que todos los campos esten correctos!');
    }
    console.log(comands);
    this.clear();
  }

}
