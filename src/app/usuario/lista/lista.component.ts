import { RestService } from 'src/app/shared/services/rest.service';
import { ApiService } from './../../shared/services/api.service';
import { SessionService } from '../../shared/services/session.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { faHeart, faBookmark, faTimes, faCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  private _type: string;
  
  inscricao: Subscription;
  faHeart = faHeart;
  faBookmark = faBookmark;
  faCheck = faCheck;
  faTimes = faTimes;
  faStar = faStar;
  requesting: boolean ;
  private _items: any = [];

  isMobile: boolean;
  

  constructor(private router:Router, private sessionService: SessionService, 
    private apiService: ApiService, private deviceService: DeviceDetectorService, 
    private restService: RestService) {
      
      this.isMobile = this.deviceService.isMobile();

      this.inscricao = this.router.events.subscribe((event: Event) => 
      {
          if (event instanceof NavigationEnd) {
            this.type = event.urlAfterRedirects.split("/").pop();
          }
      });
      
  }

  public get items(): any {
    return this._items;
  }
  public set items(value: any) {
    this._items = value;
    this.requesting = false;
  }


  public get type(): string {
    return this._type;
  }
  public set type(value: string) {
    this._type = value;
    
    if(this.items != '')
      this.items = [];

    this.requesting = true;
    this.loadItems();
  }
  loadItems()
  {
      this.restService.getListFromRest(this.sessionService.getIdUsuario(), 'favoritos').subscribe((favoritos:any) =>
      {
          this.restService.getListFromRest(this.sessionService.getIdUsuario(), 'interesses').subscribe(interesses => {

              this.apiService.loadListUsuario(this.type == 'favoritos' ? true : false, favoritos, interesses).subscribe(dados => {
                  this.items = dados;
              },
              (erro:any) => { 
                Swal.fire({
                  title: 'Ocorreu um erro.',
                  icon: 'error',
                  showConfirmButton: true
                });
                this.items = [];
            });
          },
          (erro:any) => { 
            Swal.fire({
              title: 'Ocorreu um erro.',
              icon: 'error',
              showConfirmButton: true
            });
            this.items = [];
        });
      },
      (erro:any) => { 
          Swal.fire({
            title: 'Ocorreu um erro.',
            icon: 'error',
            showConfirmButton: true
          });
          this.items = [];
      });
  }
  ngOnInit(){
    
  }
  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  salvar(value, isChecked, index)
  {
    if(isChecked)
    {
      Swal.fire({
        title: 'Este item já foi adicionado!',
        icon: 'info',
        showConfirmButton: true
      });
    }
    else
    {
        let reverse = this.type == 'favoritos' ? 'interesses' : 'favoritos';
        let valueSubmit = Object.assign({}, {'idFilme':value, 'idUsuario': this.sessionService.getIdUsuario()});

        this.restService.saveListFromRest(valueSubmit, reverse).subscribe((result:any) => {
        if(!result.erro)
        {
              Swal.fire({
                title: 'Adicionado a lista de ' + reverse + ' com sucesso!',
                icon: 'success',
                showConfirmButton: true,
                  onClose: () => {
                      if(!this.items[index]['checked'])
                      {
                        this.items[index]['checked'] = true;
                      }
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
  check(value, index)
  {
      Swal.fire({
        title: 'Você tem certeza?',
        text: "Você não pode reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) 
        {
            this.restService.deleteListFromRest(value, this.type).subscribe((result:any) => 
            {
                if(!result.erro)
                {
                      Swal.fire({
                        title: 'Operação realizada com sucesso!',
                        icon: 'success',
                        showConfirmButton: true,
                          onClose: () => {
                              this.items.splice(index, 1);
                          }
                      })
                }
                else
                {
                    Swal.fire({
                      title: 'Ocorreu um erro.',
                      icon: 'error',
                      showConfirmButton: true
                    });
                }
          },
          (erro:any) => Swal.fire({
            title: 'Ocorreu um erro.',
            icon: 'error',
            showConfirmButton: true
          }));
        }
      });
  }
  checkColor(checked)
  {
    return { 'text-success': checked === 'undefined' ? false : checked, 
              'text-danger': this.type == 'interesses' && !(checked === 'undefined' ? false : checked), 
              'text-primary': checked === 'undefined' ? false : !checked 
            }
  }

}
