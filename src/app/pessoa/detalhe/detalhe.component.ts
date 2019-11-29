import { faStar, faUserAlt, faVideo, faBriefcase, faPhotoVideo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from './../../shared/services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.css']
})
export class DetalheComponent implements OnInit {

  private _person: any;
  inscricao: Subscription;
  unavailable: string = 'Não disponível';

  faStar = faStar;
  faUserAlt = faUserAlt;
  faVideo = faVideo;
  faBriefcase = faBriefcase;
  faPhotoVideo = faPhotoVideo;
  faInfoCircle = faInfoCircle;

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  showNavigationIndicators = false;

  isMobile:boolean;
  
  constructor(private route: ActivatedRoute, private apiService: ApiService, 
    private deviceService: DeviceDetectorService) 
    { 
      this.isMobile = this.deviceService.isMobile(); 
    }


  public get person(): any {
    return this._person;
  }
  public set person(value: any) {
    this._person = value;
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

  ngOnInit() {

    this.inscricao = this.route.data.subscribe(
      (info) => {
        this.person = this.filter(info.pessoa);
        window.scrollTo(0, 0);
      }
    );
  

  }
  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }
  getImage(url: string, size)
  {
    return this.apiService.getApiImg(true, url, size);
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
}
