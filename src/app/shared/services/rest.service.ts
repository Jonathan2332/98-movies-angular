import { environment } from './../../../environments/environment.prod';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private readonly REST_URL = environment.API;

  constructor(protected http: HttpClient) { }

  //-------------------------------------------------Favoritos e interesses-----------------------------------------
  getListFromRest(idUsuario, type)
	{
      let url = type == 'favoritos' ? `${this.REST_URL}/favorito/list.php?idUsuario=${idUsuario}` : `${this.REST_URL}/interesse/list.php?idUsuario=${idUsuario}`;
      return this.http.get(url).pipe(take(1));
  }
  saveListFromRest(valueSubmit, type)
	{
      let url = type == 'favoritos' ? 
      `${this.REST_URL}/favorito/insert.php` : 
      `${this.REST_URL}/interesse/insert.php`;
      return this.http.post(url, JSON.stringify(valueSubmit)).pipe(take(1));
  }
  deleteListFromRest(id, type)
	{
      let url = type == 'favoritos' ? 
      `${this.REST_URL}/favorito/delete.php?idFilme=${id}` : 
      `${this.REST_URL}/interesse/delete.php?idFilme=${id}`;
      return this.http.get(url).pipe(take(1));
  }
  checkList(idFilme, idUsuario, type)
	{
      let url = type == 'favoritos' ? `${this.REST_URL}/favorito/checkmovie.php?idUsuario=${idUsuario}&idFilme=${idFilme}` : `${this.REST_URL}/interesse/checkmovie.php?idUsuario=${idUsuario}&idFilme=${idFilme}`;
      return this.http.get(url).pipe(take(1));
  }
  
  //-------------------------------------------------Perfis-----------------------------------------
  getAllPerfisFromRest()
	{
      return this.http.get(`${this.REST_URL}/perfil/list.php`).pipe(take(1));
  }
  getPerfilFromRest(id)
	{
      return this.http.get(`${this.REST_URL}/perfil/list.php?idPerfil=${id}`).pipe(take(1));
  }
  savePerfilFromRest(valueSubmit)
	{
      if(valueSubmit.idPerfil != null)
        return this.http.post(`${this.REST_URL}/perfil/update.php`, JSON.stringify(valueSubmit)).pipe(take(1));
      else
        return this.http.post(`${this.REST_URL}/perfil/insert.php`, JSON.stringify(valueSubmit)).pipe(take(1));
  }
  deletePerfilFromRest(id)
	{
      return this.http.get(`${this.REST_URL}/perfil/delete.php?idPerfil=${id}`).pipe(take(1));
  }

  //-------------------------------------------------Usuario-----------------------------------------
  getAllUsersFromRest()
	{
      return this.http.get(`${this.REST_URL}/usuario/list.php`).pipe(take(1));
  }
  getUserFromRest(id)
	{
      return this.http.get(`${this.REST_URL}/usuario/list.php?idUsuario=${id}`).pipe(take(1));
  }
  saveUserFromRest(valueSubmit)
	{
      if(valueSubmit.idUsuario != null)
        return this.http.post(`${this.REST_URL}/usuario/update.php`, JSON.stringify(valueSubmit)).pipe(take(1));
      else
        return this.http.post(`${this.REST_URL}/usuario/insert.php`, JSON.stringify(valueSubmit)).pipe(take(1));
  }
  deleteUserFromRest(id)
	{
      return this.http.get(`${this.REST_URL}/usuario/delete.php?idUsuario=${id}`).pipe(take(1));
  }


  login(valueSubmit)
  {
    return this.http.post(`${this.REST_URL}/usuario/login.php`, JSON.stringify(valueSubmit)).pipe(take(1));
  }
  getPreferenciasFromRest(id)
	{
      return this.http.get(`${this.REST_URL}/categoria/list.php?idUsuario=${id}`).pipe(take(1));
  }
  uploadImage(image)
	{
      return this.http.post(`${this.REST_URL}/foto/upload.php`, image).pipe(take(1));
  }
}
