import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class EntrarSalaService {

  constructor( private http: HttpClient, private global: GlobalService) { }

  postSala(dataObj_enviado){
    return this.http.post(this.global.endereco+'logar-sala.php',dataObj_enviado, {responseType: 'text'}).pipe(catchError(this.errorHandler));
                    
  }
  
  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || "Server Error");
  }
}
