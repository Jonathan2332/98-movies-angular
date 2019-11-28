import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService {

  constructor(private http: HttpClient) { }

  verificarEmail(email: string) {
    return this.http.get('https://98movies.000webhostapp.com/restful/api/rest/view/usuario/checkemail.php?email='+email).pipe(take(1));
  }
}
