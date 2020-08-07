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

  consultar(url: string) {
    return this.http.get(Configuracion.direccion + url);
  }

  consultaURLlibre(url: string) {
    return this.http.get(url);
  }

  post(object: any, url): Observable<any> {
    return this.http.post<any>(url, object, httpOptions)
      .pipe(
        catchError(SendComandsService.handleError)
      );
  }


}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};
