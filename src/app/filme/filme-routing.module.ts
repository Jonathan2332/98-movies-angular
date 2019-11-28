import { DetalheComponent } from './detalhe/detalhe.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilmeComponent } from './filme.component';
import { BuscarComponent } from './buscar/buscar.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { FilmeResolver } from './guards/filme.resolver';


const routes: Routes = [
  {path: '', component: FilmeComponent,
  children: [
    { path: '', redirectTo:'/usuario/home/populares', pathMatch:'full' },
    { path: 'buscar', component: BuscarComponent },
    { path: 'explorar', component: ExplorarComponent },
    { path: ':id', component: DetalheComponent, resolve: { filme : FilmeResolver } }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmeRoutingModule { }
