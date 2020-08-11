import {Component, OnInit} from '@angular/core';
import {Sesion} from '../Sesion/sesion';
import {Alert, alertConfirm} from '../Alerts/Alert';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {VlanModel} from '../Modelos/VlanModel';
import {Routers} from '../ModelosComando/Routers';
import {group} from '@angular/animations';
import {SendComandsService} from '../services/send-comands.service';
import {URLServer} from '../URL/URLServer';

@Component({
  selector: 'app-direccionamiento',
  templateUrl: './direccionamiento.component.html',
  styleUrls: ['./direccionamiento.component.css']
})
export class DireccionamientoComponent implements OnInit {
  public sesion = new Sesion();
  public routerComands = new Routers();
  public alerta = new Alert();
  public ventana: boolean = false;
  public globalComands2: string[] = [];
  public globalComands: string[] = [];
  public listCables: string[] = [];
  public listInterfaces: Datos[] = [];
  public listSubInterfaces: string[] = [];
  public formInterfaces: FormGroup;
  public formSubInterfaces: FormGroup;
  public formEliminarSubInt: FormGroup;
  public showClockRate: boolean = false;
  public showClockRate2: boolean = false;
  public selectCable: string = null;

  constructor(public ruta: Router, public formBuilder: FormBuilder, public api: SendComandsService) {
    this.formInterfaces = this.formBuilder.group({
      cableEntrada: [null, Validators.compose([Validators.required, Validators.pattern('^(FastEthernet|GigabitEthernet|Serial)[0-9]/[0-9]$')])],
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
    });
    this.formSubInterfaces = this.formBuilder.group({
      vlan: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      cableEntrada: [null, Validators.compose([Validators.required, Validators.pattern('^(FastEthernet|GigabitEthernet|Serial)[0-9]/[0-9]$')])],
      cableEntrada2: [null, Validators.compose([Validators.required, Validators.pattern('^(FastEthernet|GigabitEthernet|Serial)[0-9]/[0-9]$')])],
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
    });
    this.formEliminarSubInt = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
    });
  }


  ngOnInit() {
    this.checksesion();
    // this.api.consultar(URLServer.direccionamiento,'').subscribe((response:any)=>{
    //   //Consulta de los cables
    // })
    let response: any = {
      'respuesta': {
        'estado': 'success',
        'interfaces': ['GigabitEthernet0/0', 'GigabitEthernet0/1'],
        'subinterfaceIp': [],
        'subinterfaces': [],
        'interfaceIp': ['GigabitEthernet0/0 ip address 192.168.0.50 255.255.255.0 du', 'GigabitEthernet0/1 ip address 192.168.1.101 255.255.255.0 d'
        ]
      }
    };

    if (response.respuesta.estado === 'success') {
      this.listCables = [];
      response.respuesta.interfaces.forEach((int) => {
        this.listCables.push(int);
      });
      response.respuesta.subinterfaces.forEach((sb)=>{
        this.listSubInterfaces.push(sb)
      })
      response.respuesta.interfaceIp.forEach((int)=>{
        let save= int.split(" ");
        this.listInterfaces.push({cable: save[0], ip: save[3], mask: save[4]});
      })
    }
  }

  selecSerial() {
    let cable: string = this.formInterfaces.controls.cableEntrada.value;
    if(cable){
      if (cable.includes('se')) {
        this.showClockRate = true;
        this.formInterfaces.addControl('clockrate', new FormControl([null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(64000)])]));
      } else {
        this.showClockRate = false;
        this.formInterfaces.removeControl('clockrate');
      }
    }
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !');
      this.ruta.navigate(['']);
    }
  }

  gudardarInterface() {
    let comands: string[] = [];
    if (this.formInterfaces.valid) {
      comands.push(this.routerComands.int + this.formInterfaces.controls.cableEntrada.value);
      comands.push(this.routerComands.ip_address + this.formInterfaces.controls.ipEntrada.value + ' ' + this.formInterfaces.controls.mask.value);
      if (this.showClockRate2) {
        comands.push(this.routerComands.clock_rate + this.formInterfaces.controls.clockrate.value);
      }
      comands.push(this.routerComands.no_shutdown);
      comands.push(this.routerComands.exit);

      let sendComands = '';
      comands.forEach((cmd) => {
        sendComands += cmd + ',';
      });
      sendComands = sendComands.substring(0, sendComands.length - 1);
      this.api.consultar(URLServer.envioDatos, sendComands).subscribe((response) => {
        console.log('RESPONSE-SAVE-DIR->', response);
      });
      // this.ngOnInit();
    } else {
      this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
    }
    console.log(comands);
    comands.forEach((comand) => {
      this.globalComands.push(comand);
    });
  }

  eliminarInterface(interfaces: Datos) {
    alertConfirm.fire({html: 'Esta seguro que desea eliminar la red Ip de esta subinterface'}).then((response) => {
      if (response.value) {
        let comands: string[] = [];
        comands.push(this.routerComands.int + interfaces.cable);
        comands.push('no ' + this.routerComands.ip_address + interfaces.ip + ' ' + interfaces.mask);
        comands.push(this.routerComands.exit);
        comands.forEach((comand) => {
          this.globalComands.push(comand);
        });
        let sendComands = '';
        comands.forEach((cmd) => {
          sendComands += cmd + ',';
        });
        sendComands = sendComands.substring(0, sendComands.length - 1);
        this.api.consultar(URLServer.envioDatos, sendComands).subscribe((response) => {
          console.log('RESPONSE-SAVE-DIR-d->', response);
        });
        // this.ngOnInit();
        this.alerta.alertSuccess('Se ha eliminado exitosamente !');
      }
    });
  }

  gudardarSubInterface() {
    let comands: string[] = [];
    if (this.formSubInterfaces.valid) {
      let cable2: string = this.formSubInterfaces.controls.cableEntrada2.value.toString();
      cable2 = cable2.substring(cable2.length - 1, cable2.length);
      comands.push(this.routerComands.int + this.formSubInterfaces.controls.cableEntrada.value + '.' + cable2);
      comands.push(this.routerComands.encapsulation_dot1q + this.formSubInterfaces.controls.vlan.value);
      comands.push(this.routerComands.ip_address + this.formSubInterfaces.controls.ipEntrada.value + ' ' + this.formSubInterfaces.controls.mask.value);
      comands.push(this.routerComands.no_shutdown);
      comands.push(this.routerComands.exit);
      let sendComands = '';
      comands.forEach((cmd) => {
        sendComands += cmd + ',';
      });
      sendComands = sendComands.substring(0, sendComands.length - 1);
      this.api.consultar(URLServer.envioDatos, sendComands).subscribe((response) => {
        console.log('RESPONSE-SAVE-sub->', response);
      });
      // this.ngOnInit();
    } else {
      this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
    }
    console.log(comands);
    comands.forEach((comand) => {
      this.globalComands2.push(comand);
    });
  }

  eliminarSubInterface() {
    alertConfirm.fire({html: 'Esta seguro que desea eliminar la subInterface'}).then((response) => {
      if (response.value) {
        let comands: string[] = [];
        if (this.formEliminarSubInt.valid) {
          comands.push(this.routerComands.int + this.selectCable);
          comands.push('no ' + this.routerComands.ip_address + this.formEliminarSubInt.controls.ipEntrada.value + ' ' + this.formEliminarSubInt.controls.mask.value);
          comands.push(this.routerComands.exit);
          this.alerta.alertSuccess('Se ha eliminado exitosamente !');
          let sendComands = '';
          comands.forEach((cmd) => {
            sendComands += cmd + ',';
          });
          sendComands = sendComands.substring(0, sendComands.length - 1);
          this.api.consultar(URLServer.envioDatos, sendComands).subscribe((response) => {
            console.log('RESPONSE-SAVE-sub-d->', response);
          });
          // this.ngOnInit();
        } else {
          this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
        }
        console.log(comands);
        comands.forEach((comand) => {
          this.globalComands2.push(comand);
        });
      }
    });
  }
}

class Datos {
  cable: string;
  ip: string;
  mask: string;
}


