import { PerfisComponent } from './perfis/perfis.component';
import { PessoaComponent } from './pessoa/pessoa.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { IndexComponent } from './index/index.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilmeComponent } from './filme/filme.component';
import { AuthGuard } from './shared/guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo:'/index', pathMatch:'full' },
  { path: 'index', component: IndexComponent},
  { path: 'usuario', component: UsuarioComponent, loadChildren: './usuario/usuario.module#UsuarioModule'},
  { path: 'filme', component: FilmeComponent, canActivate: [AuthGuard], loadChildren: './filme/filme.module#FilmeModule' },
  { path: 'categoria', component: CategoriaComponent, canActivate: [AuthGuard], loadChildren: './categoria/categoria.module#CategoriaModule'},
  { path: 'pessoa', component: PessoaComponent, canActivate: [AuthGuard], loadChildren: './pessoa/pessoa.module#PessoaModule'},
  { path: 'perfis', component: PerfisComponent, canActivate: [AuthGuard], loadChildren: './perfis/perfis.module#PerfisModule'},
  { path: '**', component: PageErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
