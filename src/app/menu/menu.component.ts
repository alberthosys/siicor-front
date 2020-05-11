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
    this.menu.push({icono: 'home', nombre: 'Página Incial'})
    this.menu.push({icono: 'arrow_forward', nombre: 'Direccionamiento'})
    this.menu.push({icono: 'navigation', nombre: 'Enrutamiento'})
    this.menu.push({icono: 'trip_origin', nombre: 'ACL'})
    this.menu.push({icono: 'layers', nombre: 'VLAN'})
    this.menu.push({icono: 'exit_to_app', nombre: 'Cerrar Sesión'})
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
}

