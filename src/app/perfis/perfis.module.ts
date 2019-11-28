import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfisRoutingModule } from './perfis-routing.module';
import { PerfisComponent } from './perfis.component';
import { ListPerfilComponent } from './list-perfil/list-perfil.component';
import { FormularioPerfilComponent } from './formulario-perfil/formulario-perfil.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PerfisComponent, ListPerfilComponent, FormularioPerfilComponent],
  imports: [
    CommonModule,
    PerfisRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class PerfisModule { }
