import {Component, OnInit} from '@angular/core';
import {Sesion} from "../Sesion/sesion";
import {Alert, alertConfirm} from "../Alerts/Alert";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Routers} from "../ModelosComando/Routers";

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
  public host_any:boolean=false;
  public in_out2: boolean = false;
  public listClables: string[] = [];
  public globalComands: string[] = [];
  public globalComands2: string[] = [];
  public listACLlist: string[] = []
  public listACLlist2: string[] = []
  public listProcolos: string[] = [];
  public formEliminar:FormGroup;
  public itemReference:any=null;
  constructor(
    public ruta: Router,
    public formBuilder: FormBuilder
  ) {
    this.formAclEstandar = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      group: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(1), Validators.max(99)])],
      cableEntrada: [null, Validators.compose([Validators.required, Validators.pattern("^(fa|gig)[0-9]/[0-9]$")])]
    });
    this.formAclExtendida = formBuilder.group({
      ipEntrada: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      mask: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      protocolo: [null, Validators.compose([Validators.required])],
      ipDestino: [null, Validators.compose([Validators.required, Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      mask2: [null, Validators.compose([Validators.pattern("((^|\\.)((25[0-5]_*)|(2[0-4]\\d_*)|(1\\d\\d_*)|([1-9]?\\d_*))){4}_*$")])],
      group: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(100), Validators.max(199)])],
      cableEntrada: [null, Validators.compose([Validators.required, Validators.pattern("^(fa|gig)[0-9]/[0-9]$")])],
      puerto: [null, Validators.compose([Validators.required, Validators.pattern("[0-9]*")])]
    });
    this.formEliminar=formBuilder.group({
      group: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(100)])]
    })
  }

  ngOnInit() {
    this.checksesion();
    this.listClables.push("fa0/0");
    this.listClables.push("fa0/1");
    this.listClables.push("fa0/2");
    this.listACLlist.push("access-list 3 deny host 1.1.1.1");
    this.listACLlist2.push("10 permit tcp 192.1.1.1 0.0.0.0 host 10.10.10.10 eq www");
    this.listProcolos.push("ospf")
    this.listProcolos.push("ftp")
    this.listProcolos.push("http")
  }

  checksesion() {
    if (!this.sesion.getSesion()) {
      this.alerta.alertError('¡ No se ha iniciado sesión !')
      this.ruta.navigate([''])
    }
  }

  guardar() {
    let listComands: string[] = [];
    if (this.formAclEstandar.valid) {
      listComands.push(this.comandos.access_list + this.formAclEstandar.controls.group.value +" "+( this.permit_deny?'permit':'deny')+ this.comandos.host + this.formAclEstandar.controls.ipEntrada.value);
      // listComands.push(this.comandos.access_list + this.formAclEstandar.controls.group.value + this.comandos.permit_any);
      listComands.push(this.comandos.int + this.formAclEstandar.controls.cableEntrada.value);
      listComands.push(this.comandos.ip_acess_group + this.formAclEstandar.controls.group.value + " " + (this.in_out ? "out" : "in"));
      listComands.push(this.comandos.exit)
    } else {
      this.alerta.alertError("Revisa que todos los campos se hayan llenado correctamente")
      //Validaciones
    }
    listComands.forEach((save) => {
      this.globalComands.push(save);
    })
    console.log("Comands->", listComands)
  }

  guradarAclExtendida() {
    console.log(this.formAclExtendida.controls)
    if (this.formAclExtendida.valid) {
      let comands: string[] = [];
      let splitMask: number[] = this.formAclExtendida.controls.mask.value.split(".");
      let wildcard: string = ""
      splitMask.forEach((result) => {
        console.log(result)
        wildcard += (255 - result)
        wildcard += "."
      })
      wildcard = wildcard.substring(0, wildcard.length - 1)
      let widlcard2:string=null;
      let splitMask2: number[]=[]
      if(this.formAclExtendida.controls.mask2.value.toString().length>5){
        splitMask=this.formAclExtendida.controls.mask2.value.split(".");
        splitMask.forEach((result) => {
          console.log(result)
          widlcard2 += (255 - result)
          widlcard2 += "."
        })
        widlcard2 = wildcard.substring(0, widlcard2.length - 1)
      }

      comands.push(this.comandos.access_list + this.formAclExtendida.controls.group.value + (this.permit_deny2 ? " permit " : " deny ")+"ip " + this.formAclExtendida.controls.protocolo.value + " " + this.formAclExtendida.controls.ipEntrada.value + " " + wildcard + (!this.host_any?this.comandos.host:this.comandos.any )+ this.formAclExtendida.controls.ipDestino.value + " " +(widlcard2?widlcard2+' ':'')+ this.formAclExtendida.controls.puerto.value);
      comands.push(this.comandos.int + this.formAclExtendida.controls.cableEntrada.value);
      comands.push(this.comandos.ip_acess_group + this.formAclExtendida.controls.group.value + " " + (this.in_out2 ? "out " : "in "));
      comands.push(this.comandos.exit);
      console.log("COMANDOS->", comands)
      comands.forEach((cmd)=>{
        this.globalComands2.push(cmd)
      })
    } else {
      this.alerta.alertError("Revisa que todos los campos se hayan llenado correctamente")
    }

  }

  eliminar(acl: string) {
    alertConfirm.fire({html:"Se eliminarán todas las sentencias asociadas a esta lista de acceso. ¿Está seguro que desea eliminar este grupo?"}).then((response)=>{
      if(response.value){
        let comand: string = "no " + acl;
        console.log("ELiminar->" + comand)
        this.globalComands.push(comand)
        this.alerta.alertSuccess("Se ha eliminado exitosamente !")
      }
    });
  }
  eliminarExtentida(){
    alertConfirm.fire({html:"Se eliminarán todas las sentencias asociadas a esta lista de acceso. ¿Está seguro que desea eliminar este grupo?"}).then((response)=>{
      if(response.value){
        console.log("IP->",this.itemReference)
        let split:string[]=this.itemReference.split(" ");
        let comand: string = "no " +this.comandos.access_list+" "+this.formEliminar.controls.group.value+" permit "+split[2]+" "+split[3];
        console.log("1ELiminar->" + comand)
        this.globalComands2.push(comand)
        this.alerta.alertSuccess("Se ha eliminado exitosamente !")
      }
    });
  }

}
