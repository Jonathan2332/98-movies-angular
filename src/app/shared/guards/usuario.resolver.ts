import { RestService } from 'src/app/shared/services/rest.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { SessionService } from '../services/session.service';


@Injectable()
export class UsuarioResolver implements Resolve<any> {

    constructor(private restService: RestService, private sessionService: SessionService)
    {

    }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        
        let subject = new Subject<any>();
        let id = route.queryParams['id'];

        Swal.fire({
            title: 'Carregando...',
            width: 300,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timerProgressBar: true,
            onBeforeOpen: () => {
              Swal.showLoading();

              this.restService.getUserFromRest(id ? id : this.sessionService.getIdUsuario()).subscribe((usuario:any) => {

                  this.restService.getPreferenciasFromRest(id ? id : this.sessionService.getIdUsuario()).subscribe((preferencias:any) => {
                      
                      const date:any = new Date();
                      const getAge = birthDate => Math.floor((date - new Date(birthDate).getTime()) / 3.15576e+10);
                      subject.next(Object.assign({}, usuario, {'idade': getAge(usuario.data_nasc), 'categoria': preferencias }));
                      subject.complete();
                      Swal.close();
                  },
                  (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
                
              },
              (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
            }
          });
        
        return subject.asObservable();
    }
}