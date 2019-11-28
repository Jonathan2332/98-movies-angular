import { CategoriaComponent } from './categoria.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', component: CategoriaComponent,
  children: [
    { path: '', redirectTo:'/usuario/home/populares', pathMatch:'full' },
    { path: ':id', component: CategoriaComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaRoutingModule { }
