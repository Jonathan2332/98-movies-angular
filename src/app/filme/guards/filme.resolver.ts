import { RestService } from 'src/app/shared/services/rest.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';
import { SessionService } from 'src/app/shared/services/session.service';

@Injectable()
export class FilmeResolver implements Resolve<any> {

    constructor(private apiService: ApiService, private restService: RestService, private sessionService: SessionService)
    {

    }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        
        let subject = new Subject<any>();
        let id = route.params['id'];

        Swal.fire({
            title: 'Carregando...',
            width: 300,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timerProgressBar: true,
            onBeforeOpen: () => {
              Swal.showLoading();

              this.restService.checkList(id, this.sessionService.getIdUsuario(), 'interesses').subscribe((interesse:any) => {

                this.restService.checkList(id, this.sessionService.getIdUsuario(), 'favoritos').subscribe((favorito:any) => {

                  this.apiService.getDetailMovie(id).subscribe((movie:any) => {

                      subject.next(Object.assign({}, movie, {'favorito': favorito.message == null ? false : true , 'interesse': interesse.message == null ? false : true}));
                      subject.complete();
                      Swal.close();
                  },
                  (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
                },
                (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));

              },
              (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
            }
        });
        return subject.asObservable();
    }
}