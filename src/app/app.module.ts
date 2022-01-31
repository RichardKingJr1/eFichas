import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';

import { PrincipalComponent } from './principal/principal.component';
import { EntradaComponent } from './entrada/entrada.component';
import { ConfigComponent } from './config/config.component';
import { EsperaComponent } from './espera/espera.component';

import { CriarSalaService } from './services/criar-sala.service';
import { EntrarSalaService } from './services/entrar-sala.service';
import { GlobalService } from './services/global.service';
import { EsperaSalaService } from './services/espera-sala.service';
import { PrincipalService } from './services/principal.service';

import {  EntradaEsperaService } from './services/siblings/entrada-espera.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    EntradaComponent,
    ConfigComponent,
    EsperaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule
  ],
  providers: [CriarSalaService, EntrarSalaService, GlobalService, EntradaEsperaService, EsperaSalaService, PrincipalService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
