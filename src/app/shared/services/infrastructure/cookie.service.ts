import { Injectable } from "@angular/core";
import { Cookie } from "../../interfaces/Cookie/Cookie";
import { TokenPair } from "../../interfaces/Tokens/TokenPair";
import { AccessToken } from "../../interfaces/Tokens/AccessToken";
import { IsTokenPair } from "../../interceptors/IsTokenPair";

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor() {}

  public getCookie<T>(name: string): string | undefined {
    let cookies = Object.fromEntries(document.cookie
      .split('; ')
      .map(e => e.split('=')))

    return cookies[name]
  }

  public deleteCookie(cookieName: string) {
    this.setCookie({
      name: cookieName,
      value: '',
      maxAge: {
        days: 0,
        minutes: -1
      }
    });
  }

  public setCookie(cookie: Cookie) {
    document.cookie = `${cookie.name}=${cookie.value}; max-age=${cookie.maxAge.days * 24 * 60 * 60 + cookie.maxAge.minutes * 60}`
  }

  public saveToken(token: TokenPair | AccessToken) {
    if (IsTokenPair(token))
      this.setCookie({
        name: "refresh",
        value: token.refresh,
        maxAge: {
          days: 1,
          minutes: 0
        }
      })

    this.setCookie({
      name: "access",
      value: token.access,
      maxAge: {
        days: 0,
        minutes: 5
      }
    })
  }
}
