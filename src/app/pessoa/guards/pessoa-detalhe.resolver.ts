import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';


@Injectable()
export class PessoaDetalheResolver implements Resolve<any> {

    constructor(private apiService: ApiService)
    {

    }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        let id = route.params['id'];
        var subject = new Subject<any>();
        Swal.fire({
            title: 'Carregando...',
            width: 300,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timerProgressBar: true,
            onBeforeOpen: () => {
              Swal.showLoading();
  
                this.apiService.getDetailPerson(id).subscribe((dados:any) => { 

                    this.apiService.getPersonPhotos(id).subscribe((photos:any) => {
        
                        this.apiService.getPersonWorks(id).subscribe((works:any) => {
                            subject.next(Object.assign({}, dados, photos, works));
                            subject.complete();
                            Swal.close();
                        },
                        (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
                    },
                    (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
                },
                (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
            },
          });
        
        return subject.asObservable();
    }
}