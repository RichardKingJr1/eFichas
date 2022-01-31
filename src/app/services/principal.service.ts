import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer, Subject, throwError } from 'rxjs';
import { switchMap, share, retry, takeUntil,  catchError } from 'rxjs/operators';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  private stopPolling = new Subject();

  constructor(private http: HttpClient, private global: GlobalService) { }

  /*busca estatus dos jogadores, mais vez de quem joga*/
  postMesa(codigoMesa_enviado): Observable<any>{
    return timer(1, 1000).pipe(
    switchMap(() => this.http.post<any>(this.global.endereco+'mesa.php',codigoMesa_enviado).pipe(catchError(this.errorHandler))),
    retry(),
    share(),
    takeUntil(this.stopPolling)
  )};

  sairPost(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'sair.php',dataObj).pipe(catchError(this.errorHandler));               
  }

  atualizarMesa(codigoMesa_enviado: number): Observable<any>{
    return this.http.post<any>(this.global.endereco+'mesa.php',codigoMesa_enviado).pipe(catchError(this.errorHandler));
                    
  }

  nJogadores(codigoMesa_enviado: number): Observable<any>{
    return this.http.post<any>(this.global.endereco+'njogadores.php',codigoMesa_enviado).pipe(catchError(this.errorHandler));
                    
  }

  postBet(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'bet.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }


  postPay(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'pay.php',dataObj).pipe(catchError(this.errorHandler));               
  }

  postFold(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'fold.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  allIn(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'all-in.php',dataObj).pipe(catchError(this.errorHandler));               
  }

  postProxJogador(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'prox-jogador.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  postProxRound(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'prox-round.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  postProxMesa(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'prox-mesa.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  postConsolida(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'consolidado.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  postVencedor(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'vencedor.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  postVencedorFinal(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'vencedor-final.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  postBlind(dataObj: object): Observable<any>{
    return this.http.post<any>(this.global.endereco+'aumentar-blind.php',dataObj).pipe(catchError(this.errorHandler));
                    
  }

  /*-------------funcoes internas----------------*/
  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || "Server Error");
  }

  //parar pooling
  ngOnDestroy() {
    this.stopPolling.next();
 }
}
