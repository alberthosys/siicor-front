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

  constructor(public ruta: Router) {
  }

  ngOnInit() {
    let info= JSON.parse(atob(localStorage.getItem('info')));
    switch (info.dispositivo) {
      case "Router":
        this.menu.push({
          icono: 'https://image.flaticon.com/icons/png/512/553/553416.png',
          nombre: 'Página Incial',
          path: '/configuracion'
        })
        this.menu.push({
          icono: 'https://image.flaticon.com/icons/svg/833/833418.svg',
          nombre: 'Configuración básica',
          path: '/configuracionBasica'
        })
        this.menu.push({
          icono: 'https://image.flaticon.com/icons/svg/724/724820.svg',
          nombre: 'Direccionamiento',
          path: '/direccionamiento'
        })
        this.menu.push({
          icono: 'https://image.flaticon.com/icons/svg/875/875625.svg',
          nombre: 'Enrutamiento',
          path: '/enrutamiento'
        })
        this.menu.push({
          icono: 'https://image.flaticon.com/icons/svg/2972/2972258.svg',
          nombre: 'ACL',
          path: '/acl'
        })
        break;
      case "Switch":
        this.menu.push({icono: 'https://image.flaticon.com/icons/svg/2919/2919581.svg', nombre: 'VLAN', path: '/vlan'})
        break;
    }
    this.menu.push({icono: 'https://image.flaticon.com/icons/svg/1828/1828490.svg', nombre: 'Cerrar Sesión', path: '/'})
  }

  public cerrarSesion(item: Menu) {
    if (item.nombre.toLowerCase().includes('cerrar')) {
      localStorage.clear();
      this.ruta.navigate(['/'])
    }
  }


  redireccion(ruta) {
    if (ruta === '/') {
      localStorage.clear();
      this.ruta.navigate(['/'])
    } else {
      this.ruta.navigate([ruta])
    }
  }
}


class Menu {
  icono: string;
  nombre: string;
  path: string;
}

