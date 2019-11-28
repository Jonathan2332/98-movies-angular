import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _apiKey: string = 'cb6e8442bc390cb55c37de5073e3011f';
  private _apiYoutube: string = 'https://www.youtube.com/embed/';
  private _apiLanguage: string = 'pt-BR';
  private _noPoster: string = '../assets/imgs/no-poster.png';
  private _noBackdrop: string = '../assets/imgs/no-backdrop.png';
  private _noBackdropSlide: string = '../assets/imgs/no-backdrop-slide.png';
  private _unknownPerson: string = '../assets/imgs/unknown_person.png';

  constructor(private http: HttpClient) { }
  
  public get unknownPerson(): string {
    return this._unknownPerson;
  }
  public set unknownPerson(value: string) {
    this._unknownPerson = value;
  }

  public get apiKey(): string {
    return this._apiKey;
  }

  public set apiKey(value: string) {
    this._apiKey = value;
  }
	
  public get apiYoutube(): string {
    return this._apiYoutube;
  }

  public set apiYoutube(value: string) {
    this._apiYoutube = value;
  }
  
  public get apiLanguage(): string {
    return this._apiLanguage;
  }

  public set apiLanguage(value: string) {
    this._apiLanguage = value;
  }
	
  public get noPoster(): string {
    return this._noPoster;
  }

  public set noPoster(value: string) {
    this._noPoster = value;
  }
	
  public get noBackdrop(): string {
    return this._noBackdrop;
  }

  public set noBackdrop(value: string) {
    this._noBackdrop = value;
  }
	
  public get noBackdropSlide(): string {
    return this._noBackdropSlide;
  }

  public set noBackdropSlide(value: string) {
    this._noBackdropSlide = value;
  }

  getCategorias(){
      let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=${this.apiLanguage}`;
      return this.http.get(url).pipe(take(1));
  }
  getPopulares(page){
		
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}`;
    return this.http.get(url).pipe(take(1));
  }
  getLancamentos(page){
		
    let url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}&region=BR`;
    return this.http.get(url).pipe(take(1));
  }
  getAvaliados(page){
		
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}`;
    return this.http.get(url).pipe(take(1));
  }
  getCartaz(page){
		
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}&region=BR`;
    return this.http.get(url).pipe(take(1));
  }
  getFiltroCategoria(genre_id, page, cont_adulto)
  {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}&include_adult=${cont_adulto}&include_video=true&with_genres=${genre_id}`;
    return this.http.get(url).pipe(take(1));
  }
  getPessoasPopulares(page){
		
    let url = `https://api.themoviedb.org/3/person/popular?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}`;
    return this.http.get(url).pipe(take(1));
  }
  exploreMovie(page, cont_adulto, ano, sort_by, genre_ids)
	{
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}&include_adult=${cont_adulto}&with_genres=${String(genre_ids)}&primary_release_year=${ano}&sort_by=${sort_by}`;
    return this.http.get(url).pipe(take(1));
  }
  getBasedOnFavorites(genre_id, page, cont_adulto, type)
	{

    let needYear = this.yearNeeded(type) ? new Date().toJSON().slice(0,10) : "";

		let sort = this.getType(type);
		
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}&region=BR&include_adult=${cont_adulto}&include_video=true&with_genres=${genre_id}&sort_by=${sort}&primary_release_date.gte=${needYear}`;

    return this.http.get(url).pipe(take(1));
  }
  getBySearch(search, page, cont_adulto, type)
	{
    let url = `https://api.themoviedb.org/3/search/${type}?api_key=${this.apiKey}&language=${this.apiLanguage}&page=${page}&include_adult=${cont_adulto}&query=${search}`;
    return this.http.get(url).pipe(take(1));
  }
  getDetailPerson(person_id){
		let url = `https://api.themoviedb.org/3/person/${person_id}?api_key=${this.apiKey}&language=${this.apiLanguage}`;
		return this.http.get(url).pipe(take(1));
  }
  getPersonPhotos(person_id){

    let url = `https://api.themoviedb.org/3/person/${person_id}/images?api_key=${this.apiKey}`;
    return this.http.get(url).pipe(take(1));
  }
  getPersonWorks(person_id)
  {
		let url = `https://api.themoviedb.org/3/person/${person_id}/movie_credits?api_key=${this.apiKey}&language=${this.apiLanguage}`;
    return this.http.get(url).pipe(take(1));
  }
  getDetailMovie(movie_id){
		let url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${this.apiKey}&language=${this.apiLanguage}&append_to_response=videos,images,credits&include_image_language=en,null`;
		return this.http.get(url).pipe(take(1));
  }
  getRecomendations(movie_id){
		let url = `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=${this.apiKey}&language=${this.apiLanguage}&page=1`;
    return this.http.get(url).pipe(take(1));
	}

  getSimilars(movie_id){
  let url = `https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=${this.apiKey}&language=${this.apiLanguage}&page=1`;
    return this.http.get(url).pipe(take(1));
	}
  
  private getMovie(idFilme)
  {
      let url = `https://api.themoviedb.org/3/movie/${idFilme}?api_key=${this.apiKey}&language=${this.apiLanguage}`;
      return this.http.get(url).pipe(take(1));
  }
  loadListUsuario(isFavoritos, idsFavoritos, idsInteresses)
  {
      let movies:any = [];

      for(let list = 0; list < (isFavoritos ? idsFavoritos.length : idsInteresses.length); list++)
      {
        this.getMovie(isFavoritos ? idsFavoritos[list].idFilme : idsInteresses[list].idFilme).subscribe((movie:any) => {
          movies[list] = movie;
          for(let item = 0; item < (isFavoritos ? idsInteresses.length : idsFavoritos.length); item++)
          {
              if(movie.id == (isFavoritos ? idsInteresses[item].idFilme : idsFavoritos[item].idFilme))
              {
                movies[list]['checked'] = true;
                break;
              }
              movies[list]['checked'] = false;
          }
        });
      }
      return of(movies).pipe(take(1));
  }


  yearNeeded(type)
	{
    return type == 'lancamentos' ? true : false;
	}
	getType(type)
	{
		switch (type) {
			case 'populares':
				return 'popularity.desc';
			case 'avaliados':
				return 'vote_average.desc';
			case 'lancamentos':
				return 'release_date.desc';
			default:
				return '';
		}
	}
  getApiImg(person, url, size)
	{
		switch (size) {
			case 185:
				return url == null || url == '' ? (person ? this.unknownPerson : this.noPoster) : `https://image.tmdb.org/t/p/w185${url}`;
			case 250:
				return url == null || url == '' ? (person ? this.unknownPerson : this.noPoster) : `https://image.tmdb.org/t/p/w250_and_h141_face${url}`;
			case 500:
				return url == null || url == '' ? (person ? this.unknownPerson : this.noPoster) : `https://image.tmdb.org/t/p/w500${url}`;
			case 600:
				return url == null || url == '' ? (person ? this.unknownPerson : this.noPoster) : `https://image.tmdb.org/t/p/w600_and_h900_bestv2${url}`;
			case 780:
				return url == null || url == '' ? (person ? this.unknownPerson : this.noBackdropSlide) : `https://image.tmdb.org/t/p/w780${url}`;
			case 1280:
				return url == null || url == '' ? (person ? this.unknownPerson : this.noPoster) : `https://image.tmdb.org/t/p/w1280${url}`;
			case 1400:
				return url == null || url == '' ? (person ? this.unknownPerson : this.noBackdrop) : `https://image.tmdb.org/t/p/w1400_and_h450_face${url}`;
			default://original
				return url == null || url == '' ? (person ? this.unknownPerson : this.noPoster) : `https://image.tmdb.org/t/p/original${url}`;
		}
  }
  getApiVideo(url)
  {
    return `${this.apiYoutube}${url}`
  }
}
