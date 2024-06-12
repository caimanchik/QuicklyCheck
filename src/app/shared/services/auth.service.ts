import { BehaviorSubject, catchError, map, Observable, of, take, throwError } from "rxjs";
import { ITokenPair } from "../interfaces/Tokens/ITokenPair";
import { CookieService } from "./infrastructure/cookie.service";
import { HttpService } from "./infrastructure/http.service";
import { Injectable } from "@angular/core";
import { IRefreshToken } from "../interfaces/Tokens/IRefreshToken";
import { IAccessToken } from "../interfaces/Tokens/IAccessToken";
import { IsTokenPair } from "../type-guards/IsTokenPair";
import { IUserLogin } from "../interfaces/User/IUserLogin";
import { IUserRegister } from "../interfaces/User/IUserRegister";


@Injectable()
export class AuthService {
  constructor(
    private _http: HttpService,
    private _cookie: CookieService,
  ) { }

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public login(user: IUserLogin): Observable<boolean> {
    return this._http.Post<IUserLogin, ITokenPair>('token/', user, {withCredentials: false})
      .pipe(
        map(pair => {
          this.saveToken(pair)

          this.isLogged$.next(true);
          return true;
        }),
        catchError((e) => {
          this.isLogged$.next(false)

          return throwError(() => e)
        }),
        take(1)
      )
  }

  public refresh(): Observable<boolean> {
    let refresh = this._cookie.getCookie('refresh')

    if (!refresh) {
      this.isLogged$.next(false)
      return of(false)
        .pipe(take(1))
    }

    return this._http.Post<IRefreshToken, IAccessToken>(
      'token/refresh/',
      {refresh},
      {withCredentials: false})
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
        take(1)
      )
  }

  public saveToken(token: ITokenPair | IAccessToken) {
    if (IsTokenPair(token))
      this._cookie.setCookie({
        name: "refresh",
        value: token.refresh,
        maxAge: {
          days: 365,
          minutes: 0
        }
      })

    this._cookie.deleteCookie('access')

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
      .pipe(take(1))
  }

  public register(user: IUserRegister) {
    return this._http.Post<IUserRegister, boolean>(`registration/`, user, {
      withCredentials: false
    })
      .pipe(
        map(() => true),
        take(1)
      )
  }
}
