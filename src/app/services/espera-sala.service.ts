//import { Injectable, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { Observable, timer, Subscription, Subject, throwError } from 'rxjs';  traz elementos de polling nao usados
import { Observable, timer, Subject, throwError } from 'rxjs';
//*import { switchMap, tap, share, retry, takeUntil } from 'rxjs/operators';
import { switchMap, share, retry, takeUntil, catchError } from 'rxjs/operators';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class EsperaSalaService {

  //variaveis para polling
  private stopPolling = new Subject();

  constructor(private http: HttpClient, private global: GlobalService) { 

  }

  postSala(codigoSala_enviado): Observable<any>{
    return timer(1, 1000).pipe(
      switchMap(() => this.http.post<any>(this.global.endereco+'espera-sala.php',codigoSala_enviado).pipe(catchError(this.errorHandler))),
      retry(),
      share(),
      takeUntil(this.stopPolling)
   );
                    
  };
  
  //inicia partida
  iniciarSala(codigoSala_enviado): Observable<any>{
    return this.http.post<any>(this.global.endereco+'iniciar-sala.php',codigoSala_enviado).pipe(catchError(this.errorHandler));
                    
  }

  //remove gerente da sala e deleta a sala se gerente for ultimo usuário
  sairSalaG(codigoSala_enviado): Observable<any>{
    return this.http.post<any>(this.global.endereco+'sairg-sala.php',codigoSala_enviado).pipe(catchError(this.errorHandler));
                    
  }

  //remove jogador da sala
  sairSalaJ(dataObjJ_enviado): Observable<any>{
    return this.http.post<any>(this.global.endereco+'sairj-sala.php',dataObjJ_enviado).pipe(catchError(this.errorHandler));
                    
  }

  //resposta em caso de erro em http request
  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || "Server Error");
  }

  //parar pooling
  ngOnDestroy() {
    this.stopPolling.next();
 }
}
