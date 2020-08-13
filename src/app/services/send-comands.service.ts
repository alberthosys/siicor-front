import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Configuracion} from '../../config/configuracion';
import {error} from 'util';

@Injectable({
  providedIn: 'root'
})
export class SendComandsService {

  constructor(private http: HttpClient) {
  }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }


  configUrl = 'assets/config.json';
  public enviroments="https://0e1808452826.ngrok.io/"

  public url = 'WebServiceSICOR/webservicesicor/enviar/';
  public middleURl='?comando={%27comando%27:';
  public endURL='}';

  consultar(url: string,datas:string) {
    let userLocalStorage:User=JSON.parse(atob(localStorage.getItem("localip")))
    let comando={
      user:userLocalStorage,
      comando:"enable,123,configure terminal,"+datas
    }
    console.log("comandos->",comando)
    let urlSEND=this.enviroments+this.url+url+this.middleURl+JSON.stringify(comando).replace("'",'"')+this.endURL;
    console.log("URL->",urlSEND)
    return this.http.get(urlSEND);
  }


  inicialSesion(url: string,datas:any) {
    let comando={
      user:datas,
      comando:"enable,123,configure terminal"
    }
    console.log("comandos->",comando)
    let urlSEND=this.enviroments+this.url+url+this.middleURl+JSON.stringify(comando).replace("'",'"')+this.endURL;
    console.log("URL->",urlSEND)
    return this.http.get(urlSEND);
  }




}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

export class User {
  ip:string;
  usuario:string;
  clave:string;
}
