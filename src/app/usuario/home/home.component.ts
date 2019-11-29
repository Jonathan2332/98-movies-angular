import { SessionService } from '../../shared/services/session.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  type:string;
  inscricao: Subscription;
  preferencias: any[];

  constructor(private router:Router, private sessionService: SessionService) {
      this.inscricao = this.router.events.subscribe((event: Event) => 
      {
          if (event instanceof NavigationEnd) {
            this.type = event.urlAfterRedirects.split("/").pop();
          }
      });

      
      
  }
  ngOnInit(){
      this.preferencias = this.sessionService.getPreferencias();
      window.scrollTo(0,0);
  }
  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }
  getTitle()
  {
    switch (this.type) {
      case 'populares':
        return 'populares';
      case 'avaliados':
          return 'mais bem avaliados';
      case 'lancamentos':
          return 'que estreiam este ano';
      default://cartaz
        return 'em cartaz';
    }
  }
  getCategoriaName(id):string
  {
    let name;
    this.sessionService.getGenres().map(genres => id == genres.id ? name = genres.name : null);
    return name;
  }
}
