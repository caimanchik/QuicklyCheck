import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable, take } from "rxjs";
import { IUserMainInfo } from "../interfaces/User/IUserMainInfo";
import { IUserChangePassword } from "../interfaces/User/IUserChangePassword";
import { IProfile } from "../interfaces/User/IProfile";

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

  public getProfile(): Observable<IUserMainInfo> {
    return this._http.Get<IUserMainInfo>(`profile`)
      .pipe(take(1))
  }

  public saveProfile(profile: Partial<IProfile>): Observable<IProfile> {
    return this._http.Post<Partial<IProfile>, IProfile>(`profile/edit/`, profile)
      .pipe(take(1))
  }
}
