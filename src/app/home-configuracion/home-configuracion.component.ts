import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home-configuracion',
  templateUrl: './home-configuracion.component.html',
  styleUrls: ['./home-configuracion.component.css']
})
export class HomeConfiguracionComponent implements OnInit {
  public router: boolean = false;
  public dispositivoConsulta: Dispositivo;
  public form: FormGroup;

  constructor(
    public  formBuilder: FormBuilder,
  ) {
    this.form = formBuilder.group({
      dispositivo: [null, Validators.compose([Validators.required])],
      hostname: [null, Validators.compose([Validators.required])],
      version: [null, Validators.compose([Validators.required])],
      fechaModificacion: [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    let info= JSON.parse(atob(localStorage.getItem('info')));

    this.dispositivoConsulta = {dispositivo: info.dispositivo, hostname: info.nombre, version: info.modelo, fechaModificacion: '2020/05/12'};
    this.form.controls.dispositivo.setValue(this.dispositivoConsulta.dispositivo);
    this.form.controls.hostname.setValue(this.dispositivoConsulta.hostname);
    this.form.controls.version.setValue(this.dispositivoConsulta.version);
    this.form.controls.fechaModificacion.setValue(new Date(this.dispositivoConsulta.fechaModificacion).toDateString());
    console.log(this.dispositivoConsulta);
  }

}

class Dispositivo {
  dispositivo: string;
  hostname: string;
  version: string;
  fechaModificacion: string;
}
