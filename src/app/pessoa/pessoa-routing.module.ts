import { PessoaDetalheResolver } from './guards/pessoa-detalhe.resolver';
import { PopularesComponent } from './populares/populares.component';
import { PessoaComponent } from './pessoa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalheComponent } from './detalhe/detalhe.component';


const routes: Routes = [
  {path: '', component: PessoaComponent,
  children: [
    { path: '', redirectTo:'/pessoa/populares', pathMatch:'full' },
    { path: 'populares', component: PopularesComponent },
    { path: ':id', component: DetalheComponent, resolve: { pessoa : PessoaDetalheResolver } }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoaRoutingModule { }
