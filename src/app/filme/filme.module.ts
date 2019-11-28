import { FilmeResolver } from './guards/filme.resolver';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { ExplorarComponent } from './explorar/explorar.component';
import { BuscarComponent } from './buscar/buscar.component';
import { FilmeComponent } from './filme.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmeRoutingModule } from './filme-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DetalheComponent } from './detalhe/detalhe.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [FilmeComponent, BuscarComponent, ExplorarComponent, DetalheComponent],
  imports: [
    CommonModule,
    FilmeRoutingModule,
    FontAwesomeModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule
  ],
  exports:[FilmeComponent, ExplorarComponent],
  providers:[FilmeResolver]
})
export class FilmeModule { }
