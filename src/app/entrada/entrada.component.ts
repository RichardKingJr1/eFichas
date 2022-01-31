import { Component, OnInit } from '@angular/core';
import { EntrarSalaService } from '../services/entrar-sala.service';
//import { EntradaEsperaService } from '../services/siblings/entrada-espera.service';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent implements OnInit {

  constructor(private _entrarSalaService: EntrarSalaService, private router: Router, private global: GlobalService) { }
  /*variavel de controle do template*/
  public controle_sala: boolean = true;

  /*variavel de dados do template*/
  public usuario: string = this.global.usuario;
  public codigo_sala: number;
  public dataObj: object;
  public ctrl_espera: boolean = false;

  /*variavel de processamento interno*/
  public resposta: any;

  public message:string;

  ngOnInit(): void {
    /*teste inicial de comunicação entre modulos irmaos
    this._entradaEspera.currentMessage.subscribe(message => this.message = message)
    console.log(this.message);*/
  }

  criarSala() {

    if(this.usuario) {
      this.global.changeUsuario(this.usuario);
      this.router.navigateByUrl('/config');
    }else{
      window.alert('preencha seu nome');
    };
  }

  entrarSala() {
    this.controle_sala = false;
  }

  cancelarSala() {
    this.controle_sala = true;
  }

  logar(){
    this.ctrl_espera = true;

    if(this.usuario) {
      this.dataObj = {
        usuario: this.usuario,
        codigo_sala: this.codigo_sala
      };
  
      console.log(this.dataObj);
  
      this._entrarSalaService.postSala(this.dataObj)
      .subscribe(data=> { 
        this.resposta = data; //recebe os dados do servidos
        this.ctrl_espera = false;
        console.log(this.resposta);

        //testa para ver se sela esta cheia, ja começou o jogo ou a sala nao exite e move para sala de espera caso tudo esteja ok
        switch (this.resposta) {
          case 'cheio':
            window.alert('sala cheia');
            break;

          case 'comecou':
            window.alert('sala já começou');
            break;
        
          case 'nf':
            window.alert('sala não encontrada');
            break;
          
          default:
            this.global.changeLogar(this.usuario,this.codigo_sala,this.resposta); //salva no service o usuario, posicao e sala
            this.router.navigateByUrl('/espera');
            break;
        }                  
      });
    }else{
      this.ctrl_espera = false;
      window.alert('preencha seu nome');
    }
  }

}
