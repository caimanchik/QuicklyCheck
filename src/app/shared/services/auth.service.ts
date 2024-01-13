import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { TokenPair } from "../interfaces/Tokens/TokenPair";
import { CookieService } from "./infrastructure/cookie.service";
import { HttpService } from "./infrastructure/http.service";
import { Injectable } from "@angular/core";
import { RefreshToken } from "../interfaces/Tokens/RefreshToken";
import { AccessToken } from "../interfaces/Tokens/AccessToken";
import { IsTokenPair } from "../interceptors/IsTokenPair";
import { UserLogin } from "../interfaces/User/UserLogin";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private _http: HttpService,
    private _cookie: CookieService,
  ) {
  }

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public login(user: UserLogin): Observable<boolean> {
    return this._http.Post<UserLogin, TokenPair>('token/', user, {withCredentials: false}, false)
      .pipe(
        map(pair => {
          this.saveToken(pair)

          this.isLogged$.next(true);
          return true;
        }),
        catchError(() => {
          this.isLogged$.next(false)

          return of(false)
        }),
      )
  }

  public refresh(): Observable<boolean> {
    let refresh = this._cookie.getCookie('refresh')

    if (!refresh) {
      this.isLogged$.next(false)
      return of(false)
    }

    return this._http.Post<RefreshToken, AccessToken>(
      'token/refresh/',
      {refresh},
      {withCredentials: false},
      false)
      .pipe(
        map(token => {
          this.saveToken(token)
          this.isLogged$.next(true)

          return true;
        }),
        catchError(() => {
          this.isLogged$.next(false)

          return of(false)
        }),
      )
  }

  public saveToken(token: TokenPair | AccessToken) {
    if (IsTokenPair(token))
      this._cookie.setCookie({
        name: "refresh",
        value: token.refresh,
        maxAge: {
          days: 1,
          minutes: 0
        }
      })

    this._cookie.setCookie({
      name: "access",
      value: token.access,
      maxAge: {
        days: 0,
        minutes: 5
      }
    })
  }

  public logout(): Observable<void> {
    this.isLogged$.next(false)
    this._cookie.deleteCookie('access')
    this._cookie.deleteCookie('refresh')

    return of(undefined)
  }
}
