import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from "rxjs";
import { Class } from "../interfaces/Classes/Class";
import { HttpService } from "./infrastructure/http.service";
import { Student } from "../interfaces/Students/Student";
import { ClassBase } from "../interfaces/Classes/ClassBase";
import { ClassAllInfo } from "../interfaces/Classes/ClassAllInfo";
import { Test } from "../interfaces/Tests/Tests/Test";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(
    private _http: HttpService
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
            students: this.getClassStudents(id),
            tests: this.getClassTests(id)
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

  public getClassTests(id: number) {
    return this._http.Get<Test[]>(`tests`)
      .pipe(
        map(tests => tests.filter(e => e.grade === id))
      )
  }

  public getClassStudents(id: number) : Observable<Student[]> {
    return this._http.Get<Student[]>(`class/${id}/students`)
      .pipe(
        map(students => {
          return students.map((e, i) => ({
            ...e,
            id: i + 1
          }))
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
