import { SharedModule } from './../shared/shared.module';
import { CategoriaComponent } from './categoria.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';


@NgModule({
  declarations: [CategoriaComponent],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    SharedModule
  ],
  exports:[CategoriaComponent]
})
export class CategoriaModule { }
