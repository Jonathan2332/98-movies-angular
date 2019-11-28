import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCep(cep: string)
  {
    if(cep != null && cep !== '')
    {
        // var validacep = /^[0-9]{8}$/;

        // if(validacep.test(cep)) 
        // {
            return this.http.get(`//viacep.com.br/ws/${cep}/json/`).pipe(take(1));
        // }
        // else
        //     return of({erro: true, msg:'CEP Inválido!'});
    }
    else
      return of({erro: true, msg:'Preencha o CEP primeiro.'});
  }
}
