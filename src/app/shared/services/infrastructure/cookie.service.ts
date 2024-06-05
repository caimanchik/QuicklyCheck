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

    console.log(cookies[name])

    return cookies[name]
  }

  public deleteCookie(cookieName: string) {
    this.setCookie({
      name: cookieName,
      value: '',
      maxAge: {
        days: -10000000000,
        minutes: -10000000000
      }
    });
  }

  public setCookie(cookie: ICookie) {
    document.cookie = `${cookie.name}=${cookie.value};expires=${cookie.maxAge.days * 24 * 60 * 60 + cookie.maxAge.minutes * 60}`
  }
}
