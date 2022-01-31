import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { GlobalService } from './global.service';


@Injectable({
  providedIn: 'root'
})
export class CriarSalaService {


  constructor( private http: HttpClient, private global: GlobalService) { }

  postSala(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'criar-sala.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }
  
  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || "Server Error");
  }
}
