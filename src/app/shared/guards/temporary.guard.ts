import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemporaryGuard implements CanActivate {
  constructor(
    private _router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('checked')) {
      this._router.navigate(['check', 'result'])
      return false;
    }

    // if (localStorage.getItem('temp')) {
    //   this._router.navigate(['check', 'fill'])
    //   return false;
    // }

    return true;
  }
  
}
