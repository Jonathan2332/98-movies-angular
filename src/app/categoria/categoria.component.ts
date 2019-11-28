import { SessionService } from '../shared/services/session.service';
import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  nome:string;
  id: string;
  inscricao: Subscription;
  
  constructor(private router:Router, private sessionService: SessionService) {
    this.inscricao = this.router.events.subscribe((event: Event) => 
    {
        if (event instanceof NavigationEnd) {
          this.id = event.urlAfterRedirects.split("/").pop();
          this.sessionService.getGenres().map(genres => this.id == genres.id ? this.nome = genres.name : null);
        }
    });
  }

  ngOnInit() {

  }
  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

}
