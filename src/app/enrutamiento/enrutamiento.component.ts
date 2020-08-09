import {Component, OnInit} from '@angular/core';
import {Sesion} from '../Sesion/sesion';
import {Alert, alertConfirm} from '../Alerts/Alert';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Routers} from '../ModelosComando/Routers';
import {EigrpModel} from '../Modelos/EigrpModel';
import {RipModel} from '../Modelos/RipModel';
import {SendComandsService} from '../services/send-comands.service';

@Component({
  selector: 'app-enrutamiento',
  templateUrl: './enrutamiento.component.html',
  styleUrls: ['./enrutamiento.component.css'],
})
export class EnrutamientoComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public routerComand = new Routers();
  public ventana: boolean = false;
  public formEigrp: FormGroup;
  public formRip: FormGroup;
  public listaEigrpModel: EigrpModel[] = [];
  public listaEigrpAsignadosModel: EigrpModel[] = [];
  public listaRipModel: RipModel[] = [];
  public listaRipAsignadosModel: RipModel[] = [];
  public comandosEigrp: string[] = [];
  public comandosRip: string[] = [];
  public listaIp: string[] = [];

  constructor(public ruta: Router, public formBuilder: FormBuilder, public api: SendComandsService) {
    this.formEigrp = formBuilder.group({
      asn: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.max(65535), Validators.min(1)])],
      redIp: [null, Validators.compose([Validators.required])]
    });
    this.formRip = formBuilder.group({
      redRip: [null, Validators.compose([Validators.required])]
      // Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')
    });
  }

  ngOnInit() {
    this.api.consultaURLlibre('http://localhost:8080/WebServiceSICOR/webservicesicor/enviar/texto?comando={%27comando%27:%27enable,123,terminal%20length%20400,sh%20ip%20route%27}').subscribe(
      (response: any) => {
        this.listaEigrpModel.length = 0;
        this.listaIp.length = 0;
        if (response.respuesta.estado === 'success') {
          let cadena = response.respuesta.cadena.trim();
          let ips = cadena.split(',');

          ips.forEach((ip: any) => {
            console.log('S->', ip);
            if (ip.includes('rip')) {
            } else if (ip.includes('eigrp')) {
              let temp=ip.split('"');
              let router_eigrp=temp[0].trim().split(" ");
              let network=temp[1].trim().split(":");
              this.listaEigrpModel.push({"router_eigrp":router_eigrp[1].trim(),"network":network[1].split()})
            } else if(ip!="") {
              let temp=ip.split("/");
              this.listaIp.push(temp[0]+" 255.255.255.0");
            }
          });

          this.listaEigrpModel.forEach((eigrp)=>{
            this.listaIp.forEach((ip:any)=>{
              let tempListIP:string[]=[];
              console.log("UNO:"+ip+"DOS->"+eigrp.network)
              console.log(!ip.includes(eigrp.network))
              if(ip.includes(eigrp.network)){
                tempListIP.push(ip)
              }
              this.listaIp=tempListIP;
            })
          })

        }
      }
    );

    // this.listaEigrpModel.push({
    //   router_eigrp: '10',
    //   network: '192.168.10.0',
    // });
    // this.listaEigrpModel.push({
    //   router_eigrp: '10',
    //   network: '192.168.30.0',
    // });
    // this.listaEigrpModel.push({
    //   router_eigrp: '10',
    //   network: '192.168.40.0',
    // });
    // this.listaEigrpAsignadosModel.push({
    //   router_eigrp: '10',
    //   network: '192.168.10.0',
    // });
    // this.listaEigrpAsignadosModel.push({
    //   router_eigrp: '20',
    //   network: '192.168.50.0',
    // });
    for (let i = 0; i < this.listaEigrpModel.length; i++) {
      for (let l of this.listaEigrpAsignadosModel) {
        if (this.listaEigrpModel[i].network == l.network) {
          this.listaEigrpModel.splice(i, 1);
        }
      }
    }
    this.listaRipModel.push({
      network: '192.168.10.0',
    });
    this.listaRipModel.push({
      network: '10.10.10.0',
    });
    this.listaRipAsignadosModel.push({
      network: '10.10.20.0',
    });
    this.listaRipAsignadosModel.push({
      network: '10.10.10.0',
    });

    for (let i = 0; i < this.listaRipModel.length; i++) {
      for (let l of this.listaRipAsignadosModel) {
        if (this.listaRipModel[i].network == l.network) {
          this.listaRipModel.splice(i, 1);
        }
      }
    }
    this.checksesion();
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !');
      this.ruta.navigate(['']);
    }
  }

  enviarDatosEigrp() {
    //let comandos: string[] = [];
    if (this.formEigrp.valid) {
      this.comandosEigrp.push(this.routerComand.router_eigrp + this.formEigrp.controls.asn.value);
      this.comandosEigrp.push(this.routerComand.network + this.formEigrp.controls.redIp.value);
      this.comandosEigrp.push(this.routerComand.no_auto_summary);
      this.comandosEigrp.push(this.routerComand.exit);
    } else {
      this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
    }
    //http://localhost:8080/WebServiceSICOR/webservicesicor/enviar/envioDatos?comando={comando:enable,123,configure terminal,router eigrp 2,net 192.168.0.0}
    let comandsSend:string='';
    this.comandosEigrp.forEach((cmd,index)=>{
      comandsSend+=cmd;
        comandsSend+=","
    })
    comandsSend=comandsSend.substring(0,comandsSend.length-1);
    console.log("SEND->",comandsSend)

    let url="http://localhost:8080/WebServiceSICOR/webservicesicor/enviar/envioDatos?comando={%27comando%27:%27enable,123,configure terminal,"+comandsSend+"%27}";
    console.log("url->",url)
    this.api.consultaURLlibre(url).subscribe((response:any)=>{
       console.log("response-register-eigrp",response);
      this.ngOnInit();
    })
    this.ngOnInit();
    console.log('EIGRP ', this.comandosEigrp);
  }

  enviarDatosRip() {
    //let comandos: string[] = [];
    if (this.formRip.valid) {
      this.comandosRip.push(this.routerComand.router_rip);
      this.comandosRip.push(this.routerComand.version_rip);
      this.comandosRip.push(this.routerComand.network + this.formRip.controls.redRip.value);
      this.comandosRip.push(this.routerComand.no_auto_summary);
      this.comandosRip.push(this.routerComand.exit);
    } else {
      this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
    }
    let comandsSend:string='';
    this.comandosRip.forEach((cmd,index)=>{
      comandsSend+=cmd;
        comandsSend+=","
    })
    comandsSend=comandsSend.substring(0,comandsSend.length-1);
    console.log("SEND->",comandsSend)

    let url="http://localhost:8080/WebServiceSICOR/webservicesicor/enviar/envioDatos?comando={%27comando%27:%27enable,123,configure terminal,"+comandsSend+"%27}";
    console.log("url->",url)
    this.api.consultaURLlibre(url).subscribe((response:any)=>{
       console.log("response-register-rip",response);
      this.ngOnInit();
    }) 
    this.ngOnInit();
    console.log('RIP ', this.comandosRip);
  }

  eliminarEnrutamientoEigrp(posicion: number) {
    alertConfirm.fire({html: 'Se eliminarán todas las redes que contenga el enrutamiento ' + this.listaEigrpModel[posicion].router_eigrp + '. ¿Está seguro que desea eliminar el enrutamiento?'})
      .then((response) => {
        if (response.value) {
          this.comandosEigrp.push(
            (this.routerComand.no_router_eigrp +
            this.listaEigrpModel[posicion].router_eigrp).trim()
          );
          console.log('EIGRP eliminar ', this.comandosEigrp);
          let comandsSend:string='';
        this.comandosEigrp.forEach((cmd,index)=>{
          comandsSend+=cmd;
          comandsSend+=","
        })
        comandsSend=comandsSend.substring(0,comandsSend.length-1);
        console.log("SEND->",comandsSend)

        let url="http://localhost:8080/WebServiceSICOR/webservicesicor/enviar/envioDatos?comando={%27comando%27:%27enable,123,configure terminal,"+comandsSend+"%27}";
        console.log("url->",url)
        this.api.consultaURLlibre(url).subscribe((response:any)=>{
          console.log("response-register-eigrp",response);
          this.ngOnInit();
        })
        this.ngOnInit();
        }
      });
  }

  eliminarDatosEigrp(posicion: number) {
    alertConfirm.fire({html: 'Esta seguro que desea eliminar la red para el protocolo EIGRP'}).then((response) => {
      if (response.value) {
        this.comandosEigrp.push(
          (this.routerComand.router_eigrp +
          this.listaEigrpModel[posicion].router_eigrp).trim()
        );
        let comandTemp=(this.routerComand.no_network +
          this.listaEigrpModel[posicion].network).trim().replace("\r","")
        comandTemp=comandTemp.replace("\n","");
        comandTemp=comandTemp.replace("     "," ");
        this.comandosEigrp.push(
          comandTemp.trim()
        );
        this.comandosEigrp.push(this.routerComand.exit);
        console.log('EIGRP eliminar ', this.comandosEigrp);

        let comandsSend:string='';
        this.comandosEigrp.forEach((cmd,index)=>{
          comandsSend+=cmd;
          comandsSend+=","
        })
        comandsSend=comandsSend.substring(0,comandsSend.length-1);
        console.log("SEND->",comandsSend)

        let url="http://localhost:8080/WebServiceSICOR/webservicesicor/enviar/envioDatos?comando={%27comando%27:%27enable,123,configure terminal,"+comandsSend+"%27}";
        console.log("url->",url)
        this.api.consultaURLlibre(url).subscribe((response:any)=>{
          console.log("response-register-eigrp",response);
          this.ngOnInit();
        })
        this.ngOnInit();
      }
    });
  }

  eliminarDatosRip(posicion: number) {
    alertConfirm.fire({html: 'Esta seguro que desea eliminar la red para el protocolo RIP'}).then((response) => {
      if (response.value) {
        this.comandosRip.push(this.routerComand.router_rip);
        this.comandosRip.push(
          this.routerComand.no_network +
          this.listaRipAsignadosModel[posicion].network);
        this.comandosRip.push(this.routerComand.exit);
        console.log('RIP eliminar ', this.comandosRip);
      }
    });

  }

  eliminarEnrutamientoRip(posicion: number) {
    alertConfirm.fire({html: 'Se eliminarán todas las redes que contenga el enrutamiento RIP. ¿Está seguro que desea eliminar el enrutamiento?'}).then((resolve) => {
      if (resolve.value) {
        this.comandosRip.push(this.routerComand.no_router_rip);
        console.log('RIP eliminar ', this.comandosRip);
      }
    });
  }
}
