import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { LoginComponent } from './login/login.component';
import { ListaComponent } from './lista/lista.component';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './usuario.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PerfilComponent } from './perfil/perfil.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatePTParserFormatter } from '../shared/models/NgbDatePTParserFormatter';

import { NgSelectModule } from '@ng-select/ng-select';

import { SharedModule } from './../shared/shared.module';
import { GerenciarComponent } from './gerenciar/gerenciar.component';
import { AlterarComponent } from './alterar/alterar.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    LoginComponent, 
    PerfilComponent,
    ListaComponent, 
    HomeComponent, 
    UsuarioComponent, 
    CadastroComponent, 
    GerenciarComponent, 
    AlterarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsuarioRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    NgxMaskModule.forChild(options)
  ],
  providers:[
    DatePipe,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}
  ]
})
export class UsuarioModule { }
