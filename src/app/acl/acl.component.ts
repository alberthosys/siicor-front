import {Component, OnInit} from '@angular/core';
import {Sesion} from '../Sesion/sesion';
import {Alert, alertConfirm} from '../Alerts/Alert';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Routers} from '../ModelosComando/Routers';
import {URLServer} from '../URL/URLServer';
import {SendComandsService} from '../services/send-comands.service';

@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.css']
})
export class AclComponent implements OnInit {
  public sesion = new Sesion();
  public alerta = new Alert();
  public comandos = new Routers();
  public ventana: boolean = false;
  public formAclEstandar: FormGroup;
  public formAclExtendida: FormGroup;
  public in_out: boolean = false;
  public permit_deny: boolean = false;
  public permit_deny2: boolean = false;
  public host_any: boolean = false;
  public in_out2: boolean = false;
  public listClables: string[] = [];
  public globalComands: string[] = [];
  public globalComands2: string[] = [];
  public listACLlist: string[] = [];
  public listACLlist2: string[] = [];
  public listProcolos: string[] = [];
  public formEliminar: FormGroup;
  public itemReference: any = null;

  constructor(
    public ruta: Router,
    public formBuilder: FormBuilder,
    public api: SendComandsService,
  ) {
    this.formAclEstandar = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      group: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(1), Validators.max(99)])],
      cableEntrada: [null, Validators.compose([Validators.required])]
    });
    this.formAclExtendida = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      protocolo: [null, Validators.compose([Validators.required])],
      ipDestino: [null, Validators.compose([Validators.required, Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      mask2: [null, Validators.compose([Validators.pattern('((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$')])],
      group: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(100), Validators.max(199)])],
      cableEntrada: [null, Validators.compose([Validators.required])],
      puerto: [null, Validators.compose([Validators.pattern('[0-9]*')])]
    });
    this.formEliminar = formBuilder.group({
      group: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(100)])]
    });
  }

  ngOnInit() {
    this.checksesion();
    this.listClables=[];
    this.listACLlist=[];
    this.listACLlist2=[];
    this.listProcolos=[];
    this.api.consultar(URLServer.seguridad,'').subscribe((response:any)=>{
      console.log("RESP-ACC->",response)
      if (response.respuesta.estado === 'success') {
        response.respuesta.interfaces.forEach((int) => {
          this.listClables.push(int);
        });
        response.respuesta.standar.forEach((standar)=>{
          standar=standar.replace("\t","");
          standar=standar.replace("\n","");
          standar=standar.trim();
          this.listACLlist.push(standar);
        })
        response.respuesta.extended.forEach((extended)=>{
          extended=extended.replace("\t","");
          extended=extended.replace("\n","");
          extended=extended.trim();
          this.listACLlist2.push(extended);
        })
      }

    })

    this.listProcolos.push('tcp');
    this.listProcolos.push('udp');
    this.listProcolos.push('ospf');
    this.listProcolos.push('ip');
    this.listProcolos.push('icmp');
    this.listProcolos.push('eigrp');
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !');
      this.ruta.navigate(['']);
    }
  }

  guardar() {
    let listComands: string[] = [];
    if (this.formAclEstandar.valid) {
      listComands.push(this.comandos.access_list + this.formAclEstandar.controls.group.value + ' ' + (this.permit_deny ? 'permit' : 'deny') + this.comandos.host + this.formAclEstandar.controls.ipEntrada.value);
      // listComands.push(this.comandos.access_list + this.formAclEstandar.controls.group.value + this.comandos.permit_any);
      listComands.push(this.comandos.int + this.formAclEstandar.controls.cableEntrada.value);
      listComands.push(this.comandos.ip_acess_group + this.formAclEstandar.controls.group.value + ' ' + (this.in_out ? 'out' : 'in'));
      listComands.push(this.comandos.exit);
      let sendComands = '';
      listComands.forEach((cmd) => {
        sendComands += cmd + ',';
      });
      sendComands = sendComands.substring(0, sendComands.length - 1);
      this.api.consultar(URLServer.envioDatos, sendComands).subscribe((response) => {
        console.log('RESPONSE-SAVE-DIR->', response);
      });
      // this.ngOnInit();

    } else {
      this.alerta.alertError('Revisa que todos los campos se hayan llenado correctamente');
      //Validaciones
    }
    listComands.forEach((save) => {
      this.globalComands.push(save);
    });
    console.log('Comands->', listComands);
    this.ngOnInit();
  }

  guradarAclExtendida() {
    console.log(this.formAclExtendida.controls);
    if (this.formAclExtendida.valid) {
      let comands: string[] = [];
      let splitMask: number[] = this.formAclExtendida.controls.mask.value.split('.');
      let wildcard: string = '';
      splitMask.forEach((result) => {
        console.log(result);
        wildcard += (255 - result);
        wildcard += '.';
      });
      wildcard = wildcard.substring(0, wildcard.length - 1);
      let widlcard2: string = null;
      let splitMask2: number[] = [];
      if (this.formAclExtendida.controls.mask2.value.toString().length > 5) {
        splitMask = this.formAclExtendida.controls.mask2.value.split('.');
        splitMask.forEach((result) => {
          console.log(result);
          widlcard2 += (255 - result);
          widlcard2 += '.';
        });
        widlcard2 = wildcard.substring(0, widlcard2.length - 1);
      }
      let protocolo = this.formAclExtendida.controls.protocolo.value;
      if (protocolo.toLowerCase().includes('tcp') || protocolo.toLowerCase().includes('udp')) {
        comands.push(this.comandos.access_list + this.formAclExtendida.controls.group.value + (this.permit_deny2 ? ' permit ' : ' deny ') + this.formAclExtendida.controls.protocolo.value + ' ' + this.formAclExtendida.controls.ipEntrada.value + ' ' + wildcard + " " + this.formAclExtendida.controls.ipDestino.value + ' ' + (widlcard2 ? widlcard2 + ' ' : '') + ' eq ' + this.formAclExtendida.controls.puerto.value);
      } else {
        comands.push(this.comandos.access_list + this.formAclExtendida.controls.group.value + (this.permit_deny2 ? ' permit ' : ' deny ') + this.formAclExtendida.controls.protocolo.value + ' ' + this.formAclExtendida.controls.ipEntrada.value+' '+wildcard + " "+ this.formAclExtendida.controls.ipDestino.value + ' ' + (widlcard2 ? widlcard2 + ' ' : ''));
      }
      comands.push(this.comandos.int + this.formAclExtendida.controls.cableEntrada.value);
      comands.push(this.comandos.ip_acess_group + this.formAclExtendida.controls.group.value + ' ' + (this.in_out2 ? 'out ' : 'in '));
      comands.push(this.comandos.exit);
      console.log('COMANDOS->', comands);
      comands.forEach((cmd) => {
        this.globalComands2.push(cmd);
      });
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
    this.ngOnInit();

  }

  eliminar(acl: string) {
    alertConfirm.fire({html: 'Se eliminarán todas las sentencias asociadas a esta lista de acceso. ¿Está seguro que desea eliminar este grupo?'}).then((response) => {
      if (response.value) {
        let aclTemp:string[]=acl.split(" ");
        let comand: string = 'no ' + aclTemp[0]+"-"+aclTemp[1]+" "+aclTemp[2];
        console.log('ELiminar->' + comand);
        this.globalComands.push(comand);
        this.alerta.alertSuccess('Se ha eliminado exitosamente !');
        this.api.consultar(URLServer.envioDatos,comand).subscribe((response)=>{
          console.log("ResponseDeleteACL->",response)
        })
      }
    });
    this.ngOnInit();

  }

  eliminarExtentida() {
    alertConfirm.fire({html: 'Se eliminarán todas las sentencias asociadas a esta lista de acceso. ¿Está seguro que desea eliminar este grupo?'}).then((response) => {
      if (response.value) {
        console.log('IP->', this.itemReference);
        let split: string[] = this.itemReference.split(' ');
        let comand: string = 'no ' + this.comandos.access_list + ' ' + this.formEliminar.controls.group.value + ' permit ' + split[2] + ' ' + split[3];
        console.log('1ELiminar->' + comand);
        this.globalComands2.push(comand);
        this.alerta.alertSuccess('Se ha eliminado exitosamente !');
      }
      this.ngOnInit();
    });

  }

}
