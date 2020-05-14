import {Component, OnInit} from '@angular/core';
import {conditionallyCreateMapObjectLiteral} from "@angular/compiler/src/render3/view/util";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public menu: Menu[] = [];

  constructor(public ruta:Router) {
  }

  ngOnInit() {
    this.menu.push({icono: 'https://image.flaticon.com/icons/png/512/553/553416.png', nombre: 'Página Incial',path:'/configuracion'})
    this.menu.push({icono: 'https://image.flaticon.com/icons/svg/833/833418.svg', nombre: 'Configuración básica',path:'/configuracionBasica'})
    this.menu.push({icono: 'https://image.flaticon.com/icons/svg/724/724820.svg', nombre: 'Direccionamiento',path:'/direccionamiento'})
    this.menu.push({icono: 'https://image.flaticon.com/icons/svg/875/875625.svg', nombre: 'Enrutamiento',path:'/enrutamiento'})
    this.menu.push({icono: 'https://www.flaticon.com/premium-icon/icons/svg/2859/2859731.svg', nombre: 'ACL',path:'/acl'})
    this.menu.push({icono: 'https://image.flaticon.com/icons/svg/2919/2919581.svg', nombre: 'VLAN',path:'/vlan'})
    this.menu.push({icono: 'https://image.flaticon.com/icons/svg/1828/1828490.svg', nombre: 'Cerrar Sesión',path:'/'})
  }

  public cerrarSesion(item: Menu) {
    if (item.nombre.toLowerCase().includes('cerrar')) {
      localStorage.clear();
    this.ruta.navigate([''])
    }
  }
}

class Menu {
  icono: string;
  nombre: string;
  path:string;
}

