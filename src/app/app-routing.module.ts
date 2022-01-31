import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalComponent } from './principal/principal.component';
import { EsperaComponent } from './espera/espera.component';
import { ConfigComponent } from './config/config.component';
import { EntradaComponent } from './entrada/entrada.component';


const routes: Routes = [
  { path: '', redirectTo: '/entrada', pathMatch: 'full'},
  { path: 'principal', component: PrincipalComponent},
  { path: 'entrada', component: EntradaComponent},
  { path: 'config', component: ConfigComponent},
  { path: 'espera', component: EsperaComponent},
  { path: "**", component: PrincipalComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
