import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Sesion} from '../Sesion/sesion';
import {Alert} from '../Alerts/Alert';
import {SendComandsService} from '../services/send-comands.service';
import {URLServer} from '../URL/URLServer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public form: FormGroup;
  public requiredIP: boolean = false;
  public sesionInfo = new Sesion();
  public alerta = new Alert();

  constructor(
    private router: Router,
    public build: FormBuilder,
    public ruta: Router,
    public api: SendComandsService
  ) {
    this.form = this.build.group({
      // tslint:disable-next-line:max-line-length
      ip: [null, Validators.compose([Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$'), Validators.required,])],
      usuario: [null, Validators.compose([Validators.required])],
      clave: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.sesion();
  }

  sesion() {
    if (this.sesionInfo.getSesion()) {
      this.router.navigate(['/configuracion']);
    }
  }

  buscarIP() {
    console.log('f', this.form.value);
    localStorage.setItem('localip', btoa(JSON.stringify(this.form.value)));
    this.api.consultar(URLServer.sesion, '').subscribe((response: any) => {
      console.log(response);
      if (response.respuesta.estado === 'success') {
        this.ruta.navigate(['/configuracion']);
      } else {
        localStorage.clear();
        this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
      }
    });

    // console.log(this.form.valid);
    // if (this.form.valid) {
    // } else {
    // }
  }
}
