import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { PatternService } from "../services/pattern.service";
import { IAsyncGuard } from "../interfaces/Application/IAsyncGuard";
import { isFilled } from "../functions/patterns/isFilled";
import { ErrorService } from "../services/infrastructure/error.service";
import { UrlService } from "../services/infrastructure/url.service";
import { UrlToken } from "../../app.module";

@Injectable({
  providedIn: 'root'
})
export class CheckFillGuard implements IAsyncGuard {

  constructor(
    private _pattern: PatternService,
    private _router: Router,
    private _error: ErrorService,
    @Inject(UrlToken) private _urlService: UrlService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    let pk = localStorage.getItem('temp')

    if (pk === null) {
      this._router.navigate(['/', 'check'])
      return of(false)
    }

    return this._pattern.getPatterns(+pk, true)
      .pipe(
        map(patterns => {
          if (isFilled(patterns))
            return true

          if (this._urlService.getCurrentUrl().endsWith('fill'))
            this._error.createError('Сначала необходимо заполнить варианты!')

          this._router.navigate(['/', 'check', 'fill'])
          return false
        })
      )
  }
}
