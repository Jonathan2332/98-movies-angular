import { SessionService } from '../../shared/services/session.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.css']
})
export class ExplorarComponent implements OnInit {

  anos: number[] = [];
  categorias: any[];
  selectedGenres = '';
  selectedSort = null;
  selectedAno = null;

  sort = [
      { value: 'popularity.desc', name: 'Popularidade (maior)' },
      { value: 'popularity.asc', name: 'Popularidade (menor)' },
      { value: 'vote_average.desc', name: 'Avaliação (maior)' },
      { value: 'vote_average.asc', name: 'Avaliação (pior)' },
      { value: 'primary_release_date.desc', name: 'Lançamento (novo)' },
      { value: 'primary_release_date.asc', name: 'Lançamento (antigo)' },
      { value: 'original_title.asc', name: 'Título (A-Z)' },
      { value: 'original_title.desc', name: 'Título ((Z-A)' },
  ];

  constructor(private sessionService: SessionService) {

    let ano = (new Date()).getFullYear();
    for (let i = ano; i >= 1900; i--)
    {
        this.anos[ano-i] = i;
    }
    this.categorias = this.sessionService.getGenres();
  }

  ngOnInit() {
    this.selectedSort = this.sort[0].value;
    this.selectedAno = this.anos[0];
  }

}
