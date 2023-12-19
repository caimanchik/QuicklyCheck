import { Injectable } from '@angular/core';
import { delay, map, Observable } from "rxjs";
import { Class } from "../interfaces/Classes/Class";
import { HttpService } from "./infrastructure/http.service";
import { Student } from "../interfaces/Students/Student";

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
        map(classes => {
          return classes.map((e, i) => ({
            ...e,
            id: i + 1
          }))
        }),
        // delay(1000)
      )
  }

  public getClassInfo(id: number) {
    return this._http.Get<Class>(`class/${id}`)
      .pipe(
        map(classInfo => ({
          ...classInfo,
          id
        })),
        delay(1000)
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
}
