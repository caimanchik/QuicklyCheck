import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { UrlService } from "../services/infrastructure/url.service";
import { AuthToken, UrlToken } from "../../app.module";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthToken) private _auth: AuthService,
    @Inject(UrlToken) private _url: UrlService,
    private _router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._auth.isLogged$
      .pipe(tap(isLogged => {
        if (isLogged)
          return

        this._url.setCurrentUrl(route.url.map(e => e.path).join('/'))
        this._router.navigate(['login'])
      }))
      ;
  }
  
}
