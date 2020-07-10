import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Sesion} from "../Sesion/sesion";
import {Alert} from "../Alerts/Alert";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public form: FormGroup;
  public requiredIP: boolean = false;
  public sesionInfo = new Sesion();
  public alerta = new Alert();

  constructor(
    private router: Router,
    public build: FormBuilder,
    public ruta: Router
  ) {
    this.form = this.build.group({
      ip: [null, Validators.compose([Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$"),Validators.required,])],
      usuario:[null,Validators.compose([Validators.required])],
      clave:[null,Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.sesion();
  }

  sesion() {
    if (this.sesionInfo.getSesion()) {
      this.router.navigate(["/configuracion"]);
    }
  }

  buscarIP() {
    console.log(this.form.valid);
    if (this.form.valid) {
      localStorage.setItem("localip", this.form.controls.ip.value);
      this.ruta.navigate(["/configuracion"]);
    }else{
      this.alerta.alertError("Revisa que todos los campos se hayan llenado correctamente")
    }
  }
}
