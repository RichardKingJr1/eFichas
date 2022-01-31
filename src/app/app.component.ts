import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eFichas';

  constructor(private global: GlobalService) { }

  ngOnInit(): void {

    console.log(JSON.parse(localStorage.getItem('dados')));
    let local_storage_anterior = JSON.parse(localStorage.getItem('dados'));

    this.global.changeLogar(local_storage_anterior.usuario, local_storage_anterior.sala, local_storage_anterior.posicao);

  }
}
