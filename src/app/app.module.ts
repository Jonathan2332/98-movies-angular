import { PerfisModule } from './perfis/perfis.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { FilmeModule } from './filme/filme.module';
import { CategoriaModule } from './categoria/categoria.module';
import { SharedModule } from './shared/shared.module';
import { UsuarioModule } from './usuario/usuario.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { IndexComponent } from './index/index.component';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DeviceDetectorModule } from 'ngx-device-detector';


registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    PageErrorComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsuarioModule,
    CategoriaModule,
    FilmeModule,
    PessoaModule,
    SharedModule,
    PerfisModule,
    FontAwesomeModule,
    NgxMaskModule.forRoot(options),
    DeviceDetectorModule.forRoot()
  ],
  providers:[{ provide: LOCALE_ID, useValue: 'pt'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
