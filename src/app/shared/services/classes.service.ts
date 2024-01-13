import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from "rxjs";
import { Class } from "../interfaces/Classes/Class";
import { HttpService } from "./infrastructure/http.service";
import { ClassBase } from "../interfaces/Classes/ClassBase";
import { ClassAllInfo } from "../interfaces/Classes/ClassAllInfo";
import { TestService } from "./test.service";
import { StudentService } from "./student.service";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(
    private _http: HttpService,
    private _test: TestService,
    private _student: StudentService
  ) { }

  public getClasses(): Observable<Class[]> {
    return this._http.Get<Class[]>("classes")
  }

  public getClassInfo(id: number): Observable<Class> {
    return this._http.Get<Class>(`class/${id}`)
  }

  public getAllClassInfo(id: number): Observable<ClassAllInfo> {
    return this.getClassInfo(id)
      .pipe(
        switchMap(classInfo => {
          return forkJoin({
            students: this._student.getClassStudents(id),
            tests: this._test.getClassTests(id)
          })
            .pipe(
              map(testsAndStudents => ({
                ...testsAndStudents,
                ...classInfo
              }))
            )
        })
      )
  }

  public createClass(classInfo: ClassBase): Observable<Class> {
    return this._http.Post<ClassBase, Class>(`classes/`, classInfo)
  }

  public deleteClass(id: number): Observable<any> {
    return this._http.Delete<any>(`class/${id}`)
  }
}
