import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { Observable, take } from "rxjs";
import { IClass } from "../interfaces/Classes/IClass";
import { IClassAllInfo } from "../interfaces/Classes/IClassAllInfo";
import { IClassBase } from "../interfaces/Classes/IClassBase";

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(
    private _http: HttpService
  ) { }

  public getAll(): Observable<IClass[]> {
    return this._http.Get<IClass[]>("classes")
      .pipe(take(1));
  }

  public getById(id: number) : Observable<IClassAllInfo> {
    return this._http.Get<IClassAllInfo>(`class/${id}`)
      .pipe(take(1));
  }

  public createClass(classInfo: IClassBase): Observable<IClass> {
    return this._http.Post<IClassBase, IClass>(`classes/`, classInfo)
      .pipe(take(1))
  }

  public deleteClass(pkClass: number): Observable<any> {
    return this._http.Delete<any>(`class/${pkClass}`)
      .pipe(take(1))
  }

  public renameClass(classInfo: IClass) {
    return this._http.Put<IClassBase, IClass>(`class/${classInfo.pk}/`, classInfo)
      .pipe(take(1))
  }

}
