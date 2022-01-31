import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { PrincipalService } from '../services/principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  //variaveis do template
  public quantia: number;
  public ctrlBotao: boolean = false;
  public ctrlBet: boolean = true;
  public ctrlVencedor: boolean = true;
  public ctrlBlind: boolean = true;
  public valorBlind: number = 0;
  public rodada:string;

  //variaveis de processamento interno
  //public ctrlWhile: boolean;
  public resposta: any;
  public resposta_act: any;
  public dataObj: any;
  public vivos: Array<any>;

  //variaveis para a proxima partida
  public prox_botao: number;
  public prox_bb: number;
  public prox_sb: number;
  public prox_jogador_ativo: number = 1;

  constructor(private global: GlobalService, private _principalService: PrincipalService, private router: Router) { }

  ngOnInit(): void {

    this._principalService.nJogadores(this.global.sala)
      .subscribe(data=> {   
        this.global.changeNjogadores(data.n_jogadores);
      }
    );

    //long polling de jogadores e status
    this._principalService.postMesa(this.global.sala)
      .subscribe(data=> {
        this.resposta = data;
        /*habilita o botao*/
        if(this.global.posicao == this.resposta.ja) {
          this.ctrlBotao = false;
        }else {
          this.ctrlBotao = true;
        };
        /*decide se é pay ou check*/ 
        if(this.resposta.rodada == 1){
          switch(true){
            case (parseInt(this.resposta.jogadores[this.resposta.ua - 1].aposta, 10) > this.resposta.blind ):
              this.ctrlBet = false;//pay
              break;
            case(parseInt(this.resposta.jogadores[this.resposta.ja - 1].aposta, 10) == parseInt(this.resposta.blind, 10)):
              this.ctrlBet = true;//check
              break;
            default:
              this.ctrlBet = false;//pay
              break
          };
        }else{
          if(parseInt(this.resposta.jogadores[this.resposta.ua - 1].aposta, 10) != 0){
            this.ctrlBet = false;//pay
          }else{
            this.ctrlBet = true;//check
          };
        };

        /*fala para o template qual rodada q é*/
        switch (this.resposta.rodada) {
          case "1":
            this.rodada = "PRE-FLOP";
            break;
          case "2":
            this.rodada = "FLOP";
            break;
          case "3":
            this.rodada = "TURN";
            break;
          case "4":
            this.rodada = "RIVER";
            break;
          default:
            this.rodada = "ERRO";
        };
      },

    );

  }

  fold() {
    //envia dado para servidor q jogador foldou
    console.log('fold aconteceu');
    this.dataObj = {
      sala: this.global.sala,
      posicao: this.global.posicao
    };

    //muda status do jogador para off
    this._principalService.postFold(this.dataObj)
      .subscribe(data=> {
        this.resposta_act = data;  
        
         //encontra qual sera o proximo jogador ativo
    this.prox_jogador_ativo = parseInt(this.resposta.ja, 10);
    this.encontrarProx_ativo();

    //encontra o numero de jogadores ativos
    let j_on = this.jogadoresVivos(1) - 1;
    console.log('numero de jogadores ativos: '+j_on);
    //encontra o numero de jogadores em all in
    let j_all = this.jogadoresVivos(2);

    //determina o que fazer dependendo do numeor de jogadores ativos
    switch (true) {
      case (j_on <= 0):
        //nao existe mais jogadores ativos, existem apenas all in's testa se tem mais de um para fazer showdown ou nao
        console.log('numero de jogadors em all in: '+j_all);

        if(j_all>1){
          //acabou a mao, por all com 2+ all in's
          //definir vencedor
          window.alert('Indique o Vencedor');
          this.ctrlVencedor = false;
        }else{
          //sobrou apenas um all in
          console.log('vencedor por fold');
          //indica o vencedor
          this.vivos = this.listaAllIn();
          console.log(this.vivos);
          //envia o vencedor para o server
          this.entregaPote(this.vivos[0].posicao); 
          };

        break;

      case (j_on == 1):
        console.log('numero de jogadors em all in: '+j_all);
        //testa se jogador ativo ja jogou esse round 
        //(descobre se o proximo jogador é o ultimo apostador, se sim significa q esse era o ultimo a jogar, se não ainda falata gente pra jogar)
        /*if(this.prox_jogador_ativo == this.resposta.ua){
          if(j_all>0){
            //acabou a mao,  com 1 jogador ativos e 2+ all in's
            //definir vencedor
            window.alert('Indique o Vencedor');
            this.ctrlVencedor = false;
          }else{
            //sobrou apenas um all in
            console.log('vencedor por fold');
            //indica o vencedor
            this.vivos = this.listaVivos(this.global.posicao);
            console.log(this.vivos);
            //envia o vencedor para o server
            this.entregaPote(this.vivos[0].posicao);  
            };
        }else{
          console.log('jogador restante ainda nao jogou, chama o proximo jogador');
          //passa para proximo jogador, mão ou mesa
          this.proxUsuario(this.resposta.ja, this.resposta.ua, this.global.njogadores);
        }*/

        if(j_all>0){
          if(this.prox_jogador_ativo == this.resposta.ua){
            //acabou a mao,  com 1 jogador ativos e 2+ all in's
            //definir vencedor
            window.alert('Indique o Vencedor');
            this.ctrlVencedor = false;
          }else{
            console.log('jogador restante ainda nao jogou, chama o proximo jogador');
            //passa para proximo jogador, mão ou mesa
            this.proxUsuario(this.resposta.ja, this.resposta.ua, this.global.njogadores);
          };
        }else{
          //sobrou apenas um all in
          console.log('vencedor por fold');
          //indica o vencedor
          this.vivos = this.listaVivos(this.global.posicao);
          console.log(this.vivos);
          //envia o vencedor para o server
          this.entregaPote(this.vivos[0].posicao);          
        };




        break;

      default:
        console.log('dois ou mais, jogadores na mesa');
        console.log(j_on);
        //passa para proximo jogador, mão ou mesa
        this.proxUsuario(this.resposta.ja, this.resposta.ua, this.global.njogadores);
        break;
    };
      }
    );

    
    
   

  };

  check() {
    console.log('check aconteceu');
    this.proxUsuario(this.resposta.ja, this.resposta.ua, this.global.njogadores);
  };

  pay() {
    console.log('pay aconteceu');
    //testa se o valor apostado pelo ultimo apostador é maior q o caixa
    if(parseInt(this.resposta.jogadores[this.resposta.ua - 1].aposta, 10) >= parseInt(this.resposta.jogadores[this.resposta.ja - 1].caixa, 10)  || (this.resposta.rodada == 1 && parseInt(this.resposta.jogadores[this.resposta.ja - 1].caixa, 10) < this.resposta.blind)) {
      this.allIn(0);
      window.alert('All INNNNN');
    }else{
      //testa se a ultima aposta foi o blind ou uma jogada
      if(this.resposta.rodada == 1 && parseInt(this.resposta.jogadores[this.resposta.ua - 1].aposta, 10) < parseInt(this.resposta.blind, 10)){
        this.dataObj = {
          sala: this.global.sala,
          posicao: this.global.posicao,
          bet: this.resposta.blind
        };
      }else{
        this.dataObj = {
          sala: this.global.sala,
          posicao: this.global.posicao,
          bet: this.resposta.jogadores[this.resposta.ua - 1].aposta
        };
      };

      console.log(this.dataObj);

      this._principalService.postPay(this.dataObj)
        .subscribe(data=> {
          this.resposta_act = data;  
          this.proxUsuario(this.resposta.ja, this.resposta.ua, this.global.njogadores);       
        }
      );

      
    };
  };

  bet(valor_aposta) {
    console.log('bet aconteceu');
    //testa se a aposta é maior q o delta
    if (parseInt(valor_aposta, 10) >= parseInt(this.resposta.delta_aposta, 10) + parseInt(this.resposta.jogadores[this.resposta.ua - 1].aposta, 10) && (valor_aposta >= parseInt(this.resposta.blind ,10) + parseInt(this.resposta.delta_aposta, 10) || parseInt(this.resposta.rodada, 10) > 1)) {
      //testa se aconteceu all in
      if(valor_aposta >= parseInt(this.resposta.jogadores[this.resposta.ja - 1].caixa, 10)){
        console.log('valor aposta: ' + valor_aposta);
        console.log('caixa: ' + this.resposta.jogadores[this.resposta.ja - 1].caixa);
        window.alert('All INNNNN');
        this.allIn(1);
      }else{
        //testa se a ultima aposta foi o blind ou uma jogada
        if(parseInt(this.resposta.jogadores[this.resposta.ua - 1].aposta, 10) > parseInt(this.resposta.blind, 10)){
          this.dataObj = {
            sala: this.global.sala,
            posicao: this.global.posicao,
            ultima_aposta: this.resposta.jogadores[this.resposta.ua - 1].aposta,
            bet: valor_aposta
          };
        }else{
          this.dataObj = {
            sala: this.global.sala,
            posicao: this.global.posicao,
            ultima_aposta: this.resposta.blind,
            bet: valor_aposta
          };
        }
  
        console.log(this.dataObj); 
    
        this._principalService.postBet(this.dataObj)
          .subscribe(data=> {
            this.resposta_act = data;        
            //pode ter q voltar prox userr aqui se der pau
            this.proxUsuario(this.dataObj.posicao, this.dataObj.posicao, this.global.njogadores);
          }
        );
      };
    } else {
      window.alert('aposta abaixo de permitido');
    };
   
  };

  sair() {
    this.dataObj = {
      sala: this.global.sala,
      posicao: this.global.posicao
    };

    this._principalService.sairPost(this.dataObj)
      .subscribe(data=> {
      this.resposta_act = data;         
      }
    );

    if(this.resposta.ja == this.global.posicao){
      this.proxUsuario(this.resposta.ja, this.resposta.ua, this.global.njogadores);
    };

    this._principalService.ngOnDestroy();
    this.router.navigateByUrl('/entrada');
  };

  blind(){
    this.ctrlBlind = !this.ctrlBlind;
  };

  confirmarBlind(){
    console.log(this.valorBlind);
    this.dataObj= {
      blind: this.valorBlind,
      sala: this.global.sala
    };
    console.log(this.dataObj);
    this._principalService.postBlind(this.dataObj)
    .subscribe(data=> {
      this.resposta_act = data;        
      }
    ); 
    this.ctrlBlind = !this.ctrlBlind;
    window.alert('Blind será aumentado no próximo round');
  }

  /***************func internas*****************/

  allIn(tipo){
    let ultimo_apostador;
    /*descobre se a ultima aposta foi o blind ou uma aposta para calcular o valor do pote*/
    if(parseInt(this.resposta.jogadores[this.resposta.ua - 1].aposta, 10) > parseInt(this.resposta.blind, 10)){
      this.dataObj = {
        sala: this.global.sala,
        posicao: this.global.posicao,
        bet: this.resposta.jogadores[this.resposta.ja - 1].caixa,
        aposta_atual: this.resposta.jogadores[this.resposta.ja - 1].aposta,
        ultima_aposta: this.resposta.jogadores[this.resposta.ua - 1].aposta,
        tipo: tipo //se for 0 é pagamento se for 1 e bet
      };
    }else{
      this.dataObj = {
        sala: this.global.sala,
        posicao: this.global.posicao,
        bet: this.resposta.jogadores[this.resposta.ja - 1].caixa,
        aposta_atual: this.resposta.jogadores[this.resposta.ja - 1].aposta,
        ultima_aposta: this.resposta.blind,
        tipo: tipo //se for 0 é pagamento se for 1 e bet
      };
    };
    
    //necessário criar isso pq o ultimo apostador em caso de bet não foi atualizado na resposta do servidor quando a função é chamada
    if(this.dataObj.tipo == 1){
      ultimo_apostador = this.dataObj.posicao;
    }else{
      ultimo_apostador = this.resposta.ua;
    }

    this._principalService.allIn(this.dataObj)
    .subscribe(data=> {
        this.resposta_act = data;        
        //pode ter q voltar prox userr aqui se der pau
        this.proxUsuario(this.dataObj.posicao, ultimo_apostador, this.global.njogadores);
      }
    );

    console.log('all In aconteceu');
  };


  proxUsuario(jogador_ativo, ultimo_apostador, njogadores) {
    this.quantia = undefined;
    console.log('proxUsuario aconteceu');
    console.log('jogador ativo:');
    console.log(jogador_ativo);
    console.log('ultimo apostador:');
    console.log(ultimo_apostador);
    console.log('numero jogadores');
    console.log(njogadores);
    console.log(this.resposta.jogadores);

    //encontra o proximo jogador que esta ativo na jogada
    this.prox_jogador_ativo = parseInt(jogador_ativo, 10);
    this.encontrarProx_ativo();
    console.log('Loop atravessado, prox jogador ativo encontrado: '+this.prox_jogador_ativo);

    //testa se acabou a mao
    if(this.prox_jogador_ativo == ultimo_apostador || this.prox_jogador_ativo == this.resposta.ja){ 
      console.log('ultimo apostador: '+ultimo_apostador);
      //mao acabou
      //chama função de proxima mao
      this.proxRound(this.resposta.botao, njogadores);
    }else{ 
      console.log('ultimo apostador: '+ultimo_apostador);
      console.log('ainda faltam jogadores');
      //mao nao acabou
      //post para seguir para prox jogador ativo   
      this.dataObj = {
        id: this.global.sala,
        ja: this.prox_jogador_ativo
      };

      this._principalService.postProxJogador(this.dataObj)
        .subscribe(data=> {
          this.resposta_act = data;         
        }
      );
    };
  };

  proxRound(botao, njogadores) {

    this._principalService.atualizarMesa(this.global.sala)
    .subscribe(data=> {
      this.resposta = data;
      console.log('prox round aconteceu');
      //testa se exite mais de um jogador ativo
      let ativos_ctrl = this.jogadoresVivos(1);
      console.log(ativos_ctrl);
      console.log(this.resposta.rodada);
      //testa se tem 2 ou mais jogadores ativos no round e se a mão ainda nao acabou (ultimo round), se não leva para show down
      //se sim passa para a proxima mesa
      if(ativos_ctrl > 1 && this.resposta.rodada < 4){
        /***********determina proximo jogador na varida do round****************/
        this.prox_jogador_ativo = parseInt(botao, 10);
        this.encontrarProx_ativo();
          
        //proximo round
        //post para marcar proximo round, recolher bets e adicionar na mesa e marca jogador ativo e ultimo apostador
        this.dataObj = {
          id: this.global.sala,
          ja: this.prox_jogador_ativo,
          valor_mesa: this.resposta.valor_mesa,
          blind: this.resposta.blind,
          n_j_on: this.jogadoresVivos(1)
        };
    
        this._principalService.postProxRound(this.dataObj)
          .subscribe(data=> {
            this.resposta_act = data;         
          }
        );
        console.log('nao acabou a mesa, prox round round');
        console.log(this.resposta.rodada);

        
      }else{
        //acabou a mao
        //definir vencedor
        console.log('acabou a mesa')
        window.alert('indique o vencedor');
        this.ctrlVencedor = false;
      };
    })
  };

  entregaPote(vencedor) {
    console.log('entrega pote aconteceu');
    //passa as informações do vencedor para o objeto a ser enviado
    let enviarObj = {
      vencedor: vencedor,
      id: this.global.sala
    };

    this.dataObj = {
      id: this.global.sala,
      valor_mesa: this.resposta.valor_mesa,
      n_j_on: this.jogadoresVivos(1)
    };

    //consolida bets do ultimo round para eventuis all ins
    this._principalService.postConsolida(this.dataObj)
     .subscribe(data=> {
        this.resposta_act = data;  
      }
    );

    //testa se o vencedor deu all in
    if(this.resposta.jogadores[vencedor - 1].status == 1){
      /*envia os dados do vencedor final para o servidor e chama a proxima mesa*/
      console.log('envia vencedor final');
      this._principalService.postVencedorFinal(enviarObj)
      .subscribe(data=> {
        this.resposta_act = data;  
        this.proxMesa(this.global.njogadores);
        }
      );
    }else{
      console.log('entrega pote para all in');
      /*envia os dados do vencedor para o servidor e atualiza os dados recebidos do servidor*/
      this._principalService.postVencedor(enviarObj)
      .subscribe(data=> {
        this.resposta = data;  
        //se o pote na mesa acabou passo para proxima mesa, se nao busco o vencedor do proximo side pote
        if(parseInt(this.resposta.valor_mesa, 10) > 0){
          window.alert('Indique o vencedor do pote secundário');
        }else{
          //window.alert('Deve ir para a proxima rodada');
          this.proxMesa(this.global.njogadores);
        }}
      );
    }
  };


  proxMesa(njogadores) {
    console.log('prox mesa aconteceu');
    //testa se o jogo acabou ou não
    //if(n){

    //}else{
      //encontra o proximo botao
      this.prox_botao = this.encontrarProx(this.resposta.botao, njogadores);
      console.log("prox botao:");
      console.log(this.prox_botao);
      //encontrar sb
      this.prox_sb = this.encontrarProx(this.prox_botao, njogadores);
      console.log("prox sb:");
      console.log(this.prox_sb);
      //encontrar bb
      this.prox_bb = this.encontrarProx(this.prox_sb, njogadores);
      console.log("prox bb:");
      console.log(this.prox_bb);
      //encontrar ja
      this.prox_jogador_ativo = this.encontrarProx(this.prox_bb, njogadores);
      console.log("prox ja:");
      console.log(this.prox_jogador_ativo);

    
      /*original, pode ter q voltar
      this.dataObj = {
        vencedor: vencedor,
        botao: this.prox_botao,
        sb: this.prox_sb,
        bb:this.prox_bb,
        ja:this.prox_jogador_ativo,
        id: this.global.sala
      };*/

      this.dataObj = {

        botao: this.prox_botao,
        sb: this.prox_sb,
        bb:this.prox_bb,
        ja:this.prox_jogador_ativo,
        blind: this.resposta.blind,
        id: this.global.sala
      };

      window.alert('FIM DA MESA');

      /*envia os dados do vencedor para o servidor*/
      this._principalService.postProxMesa(this.dataObj)
          .subscribe(data=> {
            this.resposta_act = data;      
          }
        );
      
    //};

    this.ctrlVencedor = true;
  };

  //checar quantos jogadores ainda estao jogando
  /*obs: entrega numero de vivos menos 1, quando chamado no fold entrega o valor exato*/
  jogadoresVivos(nref){
      let n_j_on: number = 0;   
      for (let i of this.resposta.jogadores){
        if(i.status == nref){
          n_j_on = n_j_on + 1;
        };
      };
    return n_j_on;
  };

  listaVivos(posicao_desistente){
    let lista: Array<object> = [];
    let obj: object;
    for (let i of this.resposta.jogadores){
      if(i.status == 1 && posicao_desistente != i.posicao){
        obj = {
          nome: i.nome,
          posicao: i.posicao
        };
        lista.push(obj);
      };
    };
    return lista;
  };

  listaAllIn(){
    let lista: Array<object> = [];
    let obj: object;
    for (let i of this.resposta.jogadores){
      if(i.status == 2){
        obj = {
          nome: i.nome,
          posicao: i.posicao
        };
        lista.push(obj);
      };
    };
    return lista;
  };

  //envia a posição atual desejada + numero de jogadores e descobre a posição seguinte
  encontrarProx(ativo, njogadores){

    let prox_ativo: number = parseInt(ativo,10);
    let safe_loop: number = 0
    let c: boolean = true;
      while(c){
        //marca proximo jogador ativo
        if(prox_ativo < njogadores){
          prox_ativo = prox_ativo + 1;
        }else{
          prox_ativo = 1;
        };
        console.log(prox_ativo);
        //testa se o proximo jogador ativo ainda esta no jogo, se não escolhe o proximo jogador
        if(this.resposta.jogadores[prox_ativo - 1].caixa > 0 || safe_loop > 2*njogadores){
          c = false;
        };
        //protege o sistema de um loop infinito
        safe_loop = safe_loop + 1;
      };
    return prox_ativo;
  };
  
  encontrarProx_ativo(){
    let c = true;
    while(c){
      //marca proximo jogador ativo
      if(this.prox_jogador_ativo < this.global.njogadores){
        this.prox_jogador_ativo = this.prox_jogador_ativo + 1;
      }else{
        this.prox_jogador_ativo = 1;
      };
      //testa se o proximo jogador ativo ainda esta na partida, se não escolhe o proximo jogador ativo
      if(this.resposta.jogadores[this.prox_jogador_ativo - 1].status == 1 || this.resposta.jogadores[this.prox_jogador_ativo - 1] == this.resposta.ua){
        c = false;
      };
    };
  }
}
