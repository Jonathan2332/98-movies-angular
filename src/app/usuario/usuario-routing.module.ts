import { AlterarComponent } from './alterar/alterar.component';
import { UsuarioResolver } from './../shared/guards/usuario.resolver';
import { GerenciarComponent } from './gerenciar/gerenciar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaComponent } from './lista/lista.component';
import { HomeComponent } from './home/home.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { UsuarioComponent } from './usuario.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';


const routes: Routes = [
  {path: '', component: UsuarioComponent,
    children: [
        { path: '', redirectTo:'/usuario/login', pathMatch:'full' },
        {path: 'login', component: LoginComponent}, 
        {path: 'cadastro', component: CadastroComponent},
        {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard], resolve: { usuario : UsuarioResolver }},
        {path: 'gerenciar', component: GerenciarComponent, canActivate: [AuthGuard] },
        {path: 'alterar', component: AlterarComponent, canActivate: [AuthGuard], resolve: { usuario : UsuarioResolver }},
        {path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo:'/usuario/home/populares', pathMatch:'full' },
          {path: 'populares', component: HomeComponent},
          {path: 'avaliados', component: HomeComponent}, 
          {path: 'lancamentos', component: HomeComponent}, 
          {path: 'cartaz', component: HomeComponent},
        ]},
        {path: 'lista', component: ListaComponent, canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo:'/usuario/lista/favoritos', pathMatch:'full' },
          {path: 'favoritos', component: ListaComponent},
          {path: 'interesses', component: ListaComponent}, 
        ]},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
