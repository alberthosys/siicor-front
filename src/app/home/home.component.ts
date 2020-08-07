import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Sesion} from '../Sesion/sesion';
import {Alert} from '../Alerts/Alert';
import {SendComandsService} from '../services/send-comands.service';

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
    public api:SendComandsService
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
    // this.api.post({userid:1},'https://jsonplaceholder.typicode.com/posts').subscribe((response:any)=>{
    //   console.log("RESPONSE_>",response)
    // })
    // this.api.consultaURLlibre("https://da3dd404ec2a.ngrok.io/WebServiceSICOR/webservicesicor/enviar/texto?comando={%27comando%27:%27enable,123,show%20ip%20route%27}").subscribe((response:any)=>{
    //   console.log(response)
    // })
    console.log(this.form.valid);
    if (this.form.valid) {
      localStorage.setItem('localip', this.form.controls.ip.value);
      this.ruta.navigate(['/configuracion']);
    } else {
      this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
    }
  }
}
