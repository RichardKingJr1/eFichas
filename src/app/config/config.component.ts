import { Component, OnInit } from '@angular/core';
import { CriarSalaService } from '../services/criar-sala.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  /*variaveis ligadas ao template*/ 
  public quantia: number ;
  public blind: Number ;
 //public tempo_blind: number;

  /*variaveis de processamento */
  public resposta: any;
  
  private dataObj: object; // declaração do objeto para enviar para o servidor

  constructor(private _criarSalaService: CriarSalaService, private global: GlobalService, private router: Router) { }

  ngOnInit(): void {
  }

  criarSala() {

    /*atribui os dados a serem enviados*/
    this.dataObj = {
        quantia_inicial: this.quantia,
        blind: this.blind,
        //tempo_blind: this.tempo_blind,
        user: this.global.usuario
    };

    /*zera os dados enviados*/

    this.blind = undefined;
    this.quantia = undefined;
    //this.tempo_blind = undefined;

    /*envia os dados*/
    this._criarSalaService.postSala(this.dataObj)
        .subscribe(data=> {
          this.resposta = parseInt(data);
          this.global.changeCriarSala(this.resposta);
          this.router.navigateByUrl('/espera');
        });

    
  }
}
/*

envia solicitação para criar nova sala

dados enviados:
blind
quantia inicial de cada jogador
tempo para mudar blind

recebe:
numero da sala

*/