import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PessoaDetalheResolver } from './guards/pessoa-detalhe.resolver';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PessoaRoutingModule } from './pessoa-routing.module';
import { PessoaComponent } from './pessoa.component';
import { DetalheComponent } from './detalhe/detalhe.component';
import { PopularesComponent } from './populares/populares.component';


@NgModule({
  declarations: [PessoaComponent, DetalheComponent, PopularesComponent],
  imports: [
    CommonModule,
    PessoaRoutingModule,
    FontAwesomeModule,
    NgbModule,
    SharedModule
  ],
  exports:[PessoaComponent, DetalheComponent],
  providers:[PessoaDetalheResolver]
})
export class PessoaModule { }
