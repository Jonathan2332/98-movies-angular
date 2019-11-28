import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() {}

  getStorage()
  {
    return localStorage.getItem("usuario") !== null ? localStorage.getItem("usuario") : sessionStorage.getItem("usuario");
  }
  getAll()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario ? usuario : [];
  }
  getPreferencias()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.categoria ? usuario.categoria : [];
  }
  getContAdulto()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.cont_adulto ? usuario.cont_adulto : '';
  }
  getEmail()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.email ? usuario.email : '';
  }
  getNome()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.nome ? usuario.nome : '';
  }
  getSexo()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.sexo ? usuario.sexo : '';
  }
  getIdEndereco()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.idEndereco ? usuario.idEndereco : '';
  }
  getIdUsuario()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.idUsuario ? usuario.idUsuario : '';
  }
  getIdPerfil()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.idPerfil ? usuario.idPerfil : '';
  }
  getGenres()
  {
    let usuario = JSON.parse(this.getStorage());
    return usuario.genres ? usuario.genres : '';
  }
  createSession(dados, keepLoged: boolean)
  {
    keepLoged ? localStorage.setItem("usuario", JSON.stringify(dados)) : sessionStorage.setItem("usuario", JSON.stringify(dados));
  }
  isSessionCrated()
  {
    return localStorage.getItem("usuario") !== null || sessionStorage.getItem("usuario") !== null;
  }
  updateSession(dados)
  {
    let genres = this.getGenres();
    this.destroySession();
    let data = Object.assign({}, dados, {'genres': genres} );
    let local = localStorage.getItem("usuario") !== null ? true : false;
    local ? localStorage.setItem("usuario", JSON.stringify(data)) : sessionStorage.setItem("usuario", JSON.stringify(data)); 
  }
  destroySession()
  {
    localStorage.removeItem("usuario");
    sessionStorage.removeItem("usuario");
  }
}
