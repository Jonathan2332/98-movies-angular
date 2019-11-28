import { ListPerfilComponent } from './list-perfil/list-perfil.component';
import { FormularioPerfilComponent } from './formulario-perfil/formulario-perfil.component';
import { PerfisComponent } from './perfis.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';


const routes: Routes = [
    { path: '', component: PerfisComponent,
    children: [
      { path: '', redirectTo:'/perfis/index', pathMatch:'full' },
        {path: 'index', component: ListPerfilComponent},
        {path: 'formulario', component: FormularioPerfilComponent, canActivate: [AuthGuard]}, 
        {path: 'formulario/:id', component: FormularioPerfilComponent, canActivate: [AuthGuard]},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfisRoutingModule { }
