import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { AuthToken } from "../../app.module";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    @Inject(AuthToken) private _auth: AuthService,
    private _router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._auth.isLogged$
      .pipe(map(isLogged => {
        if (isLogged)
          this._router.navigate(['/', 'profile'])

        return !isLogged;
      }));
  }
  
}
