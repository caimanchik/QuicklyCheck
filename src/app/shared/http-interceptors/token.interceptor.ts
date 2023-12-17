import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from "../services/infrastructure/cookie.service";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private _cookie: CookieService,
    private _auth: AuthService
  ) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq = this.cloneWithAccessToken(request, this._cookie.getCookie('access') ?? "");
    console.log(true)

    return next.handle(newReq)
      .pipe(
        catchError(e => {
          if (e instanceof HttpErrorResponse && e.status === 401 && !newReq.url.endsWith("/token/") && !newReq.url.endsWith("/token/refresh/")) {
            return this.handle401Error(newReq, next, e)
          }

          return throwError(() => e);
        })
      );
  }

  private cloneWithAccessToken(request: HttpRequest<unknown>, access: string) : HttpRequest<unknown> {
    return request.clone({
      headers: request.headers.append("Authorization", `Bearer ${access}`)
    });
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler, e: HttpErrorResponse) : Observable<HttpEvent<any>> {
    return this._auth.refresh()
      .pipe(
        switchMap(isLogged => {
          if (isLogged)
            return next.handle(request)

          return throwError(() => e);
        })
      )
  }
}
