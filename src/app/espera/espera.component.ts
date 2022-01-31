import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { EsperaSalaService } from '../services/espera-sala.service';
import { Router } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-espera',
  templateUrl: './espera.component.html',
  styleUrls: ['./espera.component.css']
})
export class EsperaComponent implements OnInit {

  /*contole de abas*/
  public ctrlGerente: boolean = true;
  public ctrlJogador: boolean = true;

  //variaveis de controle
  public ctrlWhile: boolean;
  public resposta: any;
  public  resposta2: any;


  constructor(private global: GlobalService, private _esperaSalaService: EsperaSalaService, private router: Router) { }

    //variaveis de exposição
    public sala: number = this.global.sala;
    public dataObj: object = {
      sala: this.global.sala,
      posicao: this.global.posicao
    };

  ngOnInit(): void {

    if(this.global.posicao == 1){
      this.ctrlGerente = false;
    }else{
      this.ctrlJogador = false;
    }

    //long polling de jogadores e status
    this._esperaSalaService.postSala(this.global.sala)
      .subscribe(data=> {
        this.resposta = data;
        //muda o jogador para admin se o admin antigo saiu
          if(this.resposta.us1 == this.global.usuario){
            this.global.changePosicao(1);
            this.ctrlGerente = false;
            this.ctrlJogador = true;
          };
          //iniica o jogo
          if(this.resposta.status_sala == 1) {
            this._esperaSalaService.ngOnDestroy();

            let dataObj_local = {
              usuario: this.global.usuario,
              sala: this.global.sala,
              posicao: this. global.posicao
            };
            
            localStorage.setItem('dados', JSON.stringify(dataObj_local));
            this.router.navigateByUrl('/principal');
            //console.log(this.resposta.status_sala)
          }
      });
  }

  iniciarPartida() {
    //post iniciar partida
    this._esperaSalaService.iniciarSala(this.global.sala)
    .subscribe(data=> {
      this.resposta2 = data;
      if(this.resposta2 == true){
          this.router.navigateByUrl('/principal');
      }else{
        window.alert('falha em criar sala');
      };
    })
  }

  sairPartidaG(){

    console.log('saida G');
    //post retirar gerente da partida ou fechar a sala
    this._esperaSalaService.sairSalaG(this.global.sala)
      .subscribe(data=> {
        this.resposta = data;
        this.processoSaida(this.resposta);         
      })
  }

  sairPartidaJ(){
    //post retirar jogador da partida
    this._esperaSalaService.sairSalaJ(this.dataObj)
      .subscribe(data=> {
        this.resposta = data;
        this.processoSaida(this.resposta);         
      })
  }

  /*funções internas*/

  /*exclusao de variaveis globais + redirecionamento para entrada*/
  processoSaida(resposta) {
    if(resposta) {
      this.global.changeCriarSala(0);
      this._esperaSalaService.ngOnDestroy();
      this.router.navigateByUrl('/entrada');
    }else{
      window.alert('falha em sair da sala');
    };
  }
}
