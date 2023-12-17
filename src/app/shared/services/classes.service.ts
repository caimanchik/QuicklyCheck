import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { Class } from "../interfaces/Classes/Class";
import { HttpService } from "./infrastructure/http.service";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(
    private _http: HttpService
  ) { }

  public getClasses(): Observable<Class[]> {
    return this._http.Get<Class[]>("classes")
      .pipe(
        map(r => {
          return r.map((e, i) => ({
            ...e,
            id: i + 1
          }))
        })
      )
  }
}
