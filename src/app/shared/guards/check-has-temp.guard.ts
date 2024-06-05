import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IAsyncGuard } from "../interfaces/Application/IAsyncGuard";

@Injectable({
  providedIn: 'root'
})
export class CheckHasTempGuard implements IAsyncGuard {
  constructor(
    private _router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    let pk = localStorage.getItem('temp')

    if (pk === null) {
      return of(true)
    }

    this._router.navigate(['/', 'check', 'upload'])
    return of(false)
  }
  
}
