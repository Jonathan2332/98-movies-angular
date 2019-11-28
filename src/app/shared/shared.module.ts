import { AuthGuard } from './guards/auth.guard';
import { UsuarioResolver } from './guards/usuario.resolver';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConsultaCepService } from './services/consulta-cep.service';
import { NavbarComponent } from './navbar/navbar.component';
import { CollectionComponent } from './collection/collection.component';
import { TruncateModule } from 'ng2-truncate';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MovieComponent } from './collection/movie/movie.component';
import { PersonComponent } from './collection/person/person.component';
import { FormularioUsuarioComponent } from './formulario-usuario/formulario-usuario.component';

@NgModule({
  declarations: [
    NavbarComponent,
    CollectionComponent,
    MovieComponent,
    PersonComponent,
    FormularioUsuarioComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgSelectModule,
    NgxMaskModule,
    TruncateModule,
    NgbModule,
    RouterModule
  ],
  exports: [NavbarComponent, CollectionComponent, FormularioUsuarioComponent],
  providers:[ConsultaCepService, UsuarioResolver, AuthGuard]
})
export class SharedModule { }
