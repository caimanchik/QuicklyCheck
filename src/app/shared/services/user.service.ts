import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable, of, take } from "rxjs";
import { IUserMainInfo } from "../interfaces/User/IUserMainInfo";
import { IUserChangePassword } from "../interfaces/User/IUserChangePassword";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpService
  ) { }

  public changePassword(value: IUserChangePassword): Observable<boolean> {
    return this._http.Patch<IUserChangePassword, any>("user/password_change/", value)
      .pipe(
        map(() => true),
        take(1)
      )
  }

  public getUserEmail(): Observable<IUserMainInfo> {
    return of({
      email: "test@mail.ru",
      surname: "testov",
      name: "test",
      batya: "testovich",
    })
      .pipe(take(1))
  }
}
