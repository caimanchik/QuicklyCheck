import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IAsyncGuard } from "../interfaces/Application/IAsyncGuard";

@Injectable({
  providedIn: 'root'
})
export class CheckResultGuard implements IAsyncGuard {
  constructor(
    private _router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (!localStorage.getItem('checked')) {
      return of(true);
    }

    this._router.navigate(['check', 'result'])
    return of(false);
  }
  
}
