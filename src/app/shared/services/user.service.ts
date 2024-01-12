import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { Observable, of } from "rxjs";
import { UserMainInfo } from "../interfaces/User/UserMainInfo";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpService
  ) { }

  public getUserEmail(): Observable<UserMainInfo> {
    return of({
      email: "test@mail.ru",
      surname: "testov",
      name: "test",
      batya: "testovich",
    })
  }
}
