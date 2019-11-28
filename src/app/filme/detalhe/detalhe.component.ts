import { RestService } from './../../shared/services/rest.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { faStar, faUserAlt, faVideo, faPhotoVideo, faInfoCircle, faFilm, faClock, faThumbsUp, faUsers, faHeart, faCheck, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.css']
})
export class DetalheComponent implements OnInit {

  private _movie: any;
  id: string;
  inscricao: Subscription;

  unavailable: string = 'Não disponível';

  faStar = faStar;
  faUserAlt = faUserAlt;
  faVideo = faVideo;
  faUsers = faUsers;
  faPhotoVideo = faPhotoVideo;
  faInfoCircle = faInfoCircle;
  faFilm = faFilm;
  faClock = faClock;
  faThumbsUp = faThumbsUp;
  farThumbsUp = farThumbsUp;
  faHeart = faHeart;
  faCheck = faCheck;
  faBookmark = faBookmark;

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  showNavigationIndicators = false;
  background:any;

  recomendacoes:any;
  similares:any;

  requestingRecomendations: boolean = true;
  requestingSimilars:boolean = true;

  key:any = [ ];

  pageElenco = 1;
  pageEquipeTecnica = 1;
  pageSize = 5;

  private _crew: any;
  private _cast: any;

  public get crew(): any {
    return this._crew.map((crew, i) => ({id: i + 1, ...crew})).slice((this.pageEquipeTecnica - 1) * this.pageSize, (this.pageEquipeTecnica - 1) * this.pageSize + this.pageSize);
  }
  public set crew(value: any) {
    this._crew = value;
  }

  public get cast(): any {
    return this._cast.map((cast, i) => ({id: i + 1, ...cast})).slice((this.pageElenco - 1) * this.pageSize, (this.pageElenco - 1) * this.pageSize + this.pageSize);
  }
  public set cast(value: any) {
    this._cast = value;
  }

  public get movie(): any {
    return this._movie;
  }
  public set movie(value: any) {
    this._movie = value;
  }
  
  constructor(private route: ActivatedRoute, private apiService: ApiService, 
    private sanitizer: DomSanitizer, private modalService: NgbModal,
    private restService: RestService, private sessionService: SessionService) {
   
  }

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', windowClass: 'dark-modal'});
  }

  ngOnInit() {

    this.inscricao = this.route.data.subscribe(
      (info) => {
        
        this.movie = Object.assign({}, info.filme, { status: this.transtaleStatus(info.filme.status) });
        this.background = this.sanitizer.bypassSecurityTrustStyle(`url(${this.getImage(this.movie.backdrop_path, 1400)})`);

        for(let i = 0; i < this.movie.videos.results.length; i++)
        {
          this.key[i] = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiService.getApiVideo(this.movie.videos.results[i].key));
        }
        this.cast = this.movie.credits.cast;
        this.crew = this.movie.credits.crew;
        window.scrollTo(0, 0);
      }
    );
    
    this.apiService.getRecomendations(this.movie.id)
    .subscribe(dados => { 
      this.recomendacoes = dados;
      this.requestingRecomendations = false;
      
    });

    this.apiService.getSimilars(this.movie.id)
    .subscribe(dados => { 
      this.similares = dados;
      this.requestingSimilars = false;
    });

  }
  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  transtaleStatus(status)
    {
      switch (status) {
        case 'Rumored':
          return 'Rumor';
        case 'Planned':
          return 'Planejado';
        case 'In Production':
          return 'Em produção';
        case 'Post Production':
          return 'Pós-produção';
        case 'Released':
          return 'Lançado';
        default://Canceled
          return 'Cancelado';
      }
    }

  getImage(url: string, size)
  {
    return this.apiService.getApiImg(false, url, size);
  }
  filter(dados)
  {
    dados.place_of_birth = dados.place_of_birth == null ? this.unavailable : dados.place_of_birth;
    dados.homepage = dados.homepage == null ? this.unavailable : dados.homepage;
    dados.gender = this.filterGender(dados.gender);
    return dados;
  }
  filterGender(gender)
  {
    switch (gender) {
      case 1:
        return 'Feminino';
      case 2:
        return 'Masculino';
      default:
        return this.unavailable;
    }
  }
  isArray(obj : any ) {
    return Array.isArray(obj)
 }
  
  convertMins(n) {
    let num = n;
    let hours = (num / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return rhours + "h" + rminutes + "min";
  }

  salvar(value,type)
  {
    console.log(this.movie.favorito);
    console.log(this.movie.interesse);
    if(type == 'favoritos' ? this.movie.favorito : this.movie.interesse)
    {
      Swal.fire({
        title: 'Este item já foi adicionado!',
        icon: 'info',
        showConfirmButton: true
      });
    }
    else
    {
        let valueSubmit = Object.assign({}, {'idFilme':value, 'idUsuario': this.sessionService.getIdUsuario()});
        

        this.restService.saveListFromRest(valueSubmit, type).subscribe((result:any) => {
        if(!result.erro)
        {
              Swal.fire({
                title: 'Adicionado a lista de ' + type + ' com sucesso!',
                icon: 'success',
                showConfirmButton: true,
                  onClose: () => {
                      type == 'favoritos' ? this.movie.favorito = true : this.movie.interesse = true;
                  }
              })
        }
        else
        {
            Swal.fire({
              title: result.message,
              icon: 'error',
              showConfirmButton: true
            })
        }
      });
    }
    
    
  }

}
