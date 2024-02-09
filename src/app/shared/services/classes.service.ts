import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap, take } from "rxjs";
import { IClass } from "../interfaces/Classes/IClass";
import { HttpService } from "./infrastructure/http.service";
import { IClassBase } from "../interfaces/Classes/IClassBase";
import { IClassAllInfo } from "../interfaces/Classes/IClassAllInfo";
import { StudentService } from "./student.service";
import { ITest } from "../interfaces/Tests/Tests/ITest";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(
    private _http: HttpService,
    private _student: StudentService
  ) { }

  public getClasses(): Observable<IClass[]> {
    return this._http.Get<IClass[]>("classes")
      .pipe(take(1))
  }

  public getClassInfo(id: number): Observable<IClass> {
    return this._http.Get<IClass>(`class/${id}`)
      .pipe(take(1))
  }

  public getAllClassInfo(id: number): Observable<IClassAllInfo> {
    return this.getClassInfo(id)
      .pipe(
        switchMap(classInfo => {
          return forkJoin({
            students: this._student.getClassStudents(id),
            tests: this.getTests(id)
          })
            .pipe(
              map(testsAndStudents => ({
                ...testsAndStudents,
                ...classInfo
              }))
            )
        }),
        take(1)
      )
  }

  public createClass(classInfo: IClassBase): Observable<IClass> {
    return this._http.Post<IClassBase, IClass>(`classes/`, classInfo)
      .pipe(take(1))
  }

  public deleteClass(id: number): Observable<any> {
    return this._http.Delete<any>(`class/${id}`)
      .pipe(take(1))
  }

  public renameClass(classInfo: IClass) {
    return this._http.Put<IClassBase, IClass>(`class/${classInfo.pk}/`, classInfo)
      .pipe(take(1))
  }

  public getTests(classId: number) {
    return this._http.Get<ITest[]>(`class/${classId}/tests`)
      .pipe(take(1))
  }
}
