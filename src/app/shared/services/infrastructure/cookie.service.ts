import { Injectable } from "@angular/core";
import { Cookie } from "../../interfaces/Cookie/Cookie";

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
}
