import { SessionService } from '../services/session.service';
import { ApiService } from '../services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit {

  type: string;
  paramType: string;
  ano: any;
  sort_by: any;
  genre_id: any;
  genres_id: any[];
  search: any[];

  object: any = {};

  requesting: boolean = false;
  total_results: number;
  results_size: number;
  page: number = 1;
  list: any[];
  isMobile: boolean;

  constructor(private apiService: ApiService, private sessionService: SessionService, private deviceService: DeviceDetectorService) { this.isMobile = this.deviceService.isMobile(); }

  ngOnInit() {
    this.requesting = true;
    this.getList();
  }

  getList()
  {
    switch(this.type)
    {
        case 'populares':
          this.apiService.getPopulares(this.pageNumber)
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'lancamentos':
          this.apiService.getLancamentos(this.pageNumber)
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'avaliados':
          this.apiService.getAvaliados(this.pageNumber)
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'cartaz':
          this.apiService.getCartaz(this.pageNumber)
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'filtro':
          this.apiService.getFiltroCategoria(this.paramGenre, this.pageNumber, this.sessionService.getContAdulto())
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'pessoa':
          this.apiService.getPessoasPopulares(this.pageNumber)
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'explorar':
          this.apiService.exploreMovie(this.pageNumber,this.sessionService.getContAdulto(), this.paramAno, this.paramSortBy, this.paramMultipleGenre)
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'based':
          this.apiService.getBasedOnFavorites(this.paramGenre, this.pageNumber, this.sessionService.getContAdulto(), this.typeParam)
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
        case 'search':
          this.apiService.getBySearch(this.searchParam[1], this.pageNumber, this.sessionService.getContAdulto(), this.searchParam[0])
          .subscribe((dados : any[]) => this.setDados(dados));
          break;
    }
  }

  setDados(dados)
  {
    if(this.pageNumber == 1)
    {
      this.total_results = dados.total_results;
      this.results_size = dados.results.length;
      this.list = dados.results;
      this.requesting = false;
    }
    else{
      this.list = dados.results;
      this.requesting = false;
    }
  }

  set pageNumber(value:number){
      this.page = value;
      this.requesting = true;
      this.getList();
  }
  get pageNumber():number{
      return this.page;
  }

  @Input() set typeCollection(value:string){
      if(this.type == null)
        this.type = value;
      else
      {
        this.type = value;
        this.requesting = true;
        this.getList();
      }
  }
  get typeCollection():string{
      return this.type;
  }

  @Input() set typeParam(value:string){
    if(this.paramType == null)
        this.paramType = value;
    else
    {
      
      this.paramType = value;
      this.requesting = true;
      this.getList();
    }
  }
  get typeParam():string{
      return this.paramType;
  }

  @Input() set searchParam(value:any[]){
    
    if(this.search == null)
        this.search = value;
    else
    {
      this.search = value;
      this.requesting = true;
      this.getList();
    }
  }
  get searchParam():any[]{
      return this.search;
  }

  @Input() set paramAno(value:any){
    if(this.ano == null)
        this.ano = value;
    else
    {
      this.ano = value;
      this.requesting = true;
      this.getList();
    }
  }
  get paramAno():any{
      return this.ano;
  }

  @Input() set paramSortBy(value:any){
    if(this.sort_by == null)
      this.sort_by = value;
    else
    {
      this.sort_by = value;
      this.requesting = true;
      this.getList();   
    }
  }
  get paramSortBy():any{
      return this.sort_by;
  }

  @Input() set paramGenre(value:any){
    if(this.genre_id == null)
      this.genre_id = value;
    else
    {
      this.genre_id = value;
      this.requesting = true;
      this.getList();
    }
  }
  get paramGenre():any{
      return this.genre_id;
  }
  @Input() set paramMultipleGenre(value:any[]){
    if(this.genres_id == null)
      this.genres_id = value;
    else
    {
      this.genres_id = value;
      this.requesting = true;
      this.getList();
    }
  }
  get paramMultipleGenre():any[]{
      return this.genres_id;
  }
}
