import { Injectable } from "@angular/core";
import { ICookie } from "../../interfaces/Cookie/ICookie";

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
        minutes: -100
      }
    });
  }

  public setCookie(cookie: ICookie) {
    document.cookie = `${cookie.name}=${cookie.value}; max-age=${cookie.maxAge.days * 24 * 60 * 60 + cookie.maxAge.minutes * 60}`
  }
}
