import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private sessionService: SessionService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) : Observable<boolean> | boolean
  {
    return this.verificarAcesso(route.routeConfig.path);
  }
  private verificarAcesso(page)
  {
    if(this.sessionService.isSessionCrated())
    {
        if(this.hasPermission(this.sessionService.getIdPerfil(), page))
            return true;

        this.sessionService.destroySession();
    }
      

    this.router.navigate(['/usuario/login']);

    return false;
  }
  hasPermission(idPerfil, page)
  {
    switch(page)
    {
        case 'gerenciar':
            return idPerfil == 2 ? true : false;
        case 'perfis':
                return idPerfil == 2 ? true : false;
        case 'alterar':
                return idPerfil == 2 ? true : false;
        case 'formulario':
            return idPerfil == 2 ? true : false;
        case 'formulario/:id':
            return idPerfil == 2 ? true : false;
        default:
            return true;
    }
  }
}