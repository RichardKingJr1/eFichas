import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  //public endereco: string = 'https://localhost/PHP/eFichas/';
  public endereco: string = 'https://www.poker.prontvet.com/PHP/';

  public usuario: string;
  public sala: number;
  public posicao: number;
  public njogadores: number;

  
  /*public usuario: string = 'dsff';
  public sala: number = 291;
  public posicao: number = 1;
  public njogadores: number = 9;*/

  changeUsuario(usuario_mudar: string){
    this.usuario = usuario_mudar;
  }

  changeNjogadores(njogadores_mudar: number){
    this.njogadores = njogadores_mudar;
  }

  changeCriarSala(sala_mudar: number){
    this.posicao = 1;
    this.sala = sala_mudar;
  }

  changePosicao(posicao_mudar: number){
    this.posicao = posicao_mudar;
  }

  changeLogar(usuario_mudar: string, sala_mudar: number, posicao_mudar: number) {
    this.usuario = usuario_mudar;
    this.sala = sala_mudar;
    this.posicao = posicao_mudar;
  }
}
