import { SessionService } from '../services/session.service';
import { Component, OnInit, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { faHome, faFilm, faBars, faUsers, faSignOutAlt, faUserCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faHome = faHome; 
  faFilm = faFilm;
  faBars = faBars;
  faUsers =  faUsers;
  faSignOutAlt = faSignOutAlt;
  faUserCircle = faUserCircle;
  faSearch = faSearch;

  @Input() tema: string;
  perfil: number;
  nome: string;
  categorias: any[];
  isRolledOut: boolean = false;
  isCollapsed: boolean = false;
  busca: string;

  constructor(private router: Router, private sessionService: SessionService) {
    this.perfil = this.sessionService.getIdPerfil();
    this.nome = this.sessionService.getNome();
    this.categorias = this.sessionService.getGenres();
   }

  ngOnInit() {
    
  }
  @ViewChild('field', {static: false}) campoValorInput: ElementRef;
  @HostListener("window:scroll", []) onWindowScroll() {

    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) 
      this.isRolledOut = true;
    else
      this.isRolledOut = false;
  }
  logoff()
  {
    Swal.fire({
		  title: 'Até a próxima! :)',
		  timer: 1500,
		  
		  showConfirmButton: false,
		  allowOutsideClick: false,
		  allowEscapeKey: false,
		  imageUrl: '../assets/imgs/logoff.png',
      imageWidth: 100,
      showClass: {
        popup: 'animated jackInTheBox'
      },
			onClose: () => {
        this.router.navigate(['/usuario/login']);
        this.sessionService.destroySession();
      }
		
		})
  }
  checkBackground()
  {
      if(this.isCollapsed)
      {
        return { 'backgroundColor': this.perfil == 2 ? "red" : "rgb(92,184,92)" };
      }
      else if(this.isRolledOut)
      {
        return { 'backgroundColor': this.perfil == 2 ? "red" : "rgb(92,184,92)" };
      }
  }
  checkTheme()
  {
      if(this.isCollapsed)
      {
        return 'navbar-dark';
      }
      else if(this.isRolledOut)
      {
        return 'navbar-dark';
      }
      else
      {
        return {
          'navbar-dark': this.tema == 'dark',
          'navbar-light': this.tema == 'light',
        }
      }
  }

  redirect(movie)
  {
    this.router.navigate(['/filme/buscar'], { queryParams: { type: movie ? 'movie' : 'person', query: this.campoValorInput.nativeElement.value } });
  }

}
