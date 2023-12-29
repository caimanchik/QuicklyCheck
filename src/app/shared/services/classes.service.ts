import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
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
        // delay(400)
      )
  }

  public getClassInfo(id: number) {
    return this._http.Get<Class>(`class/${id}`)
      .pipe(
        map(classInfo => ({
          ...classInfo,
          id
        })),
        // delay(400)
      )
  }

  public getClassStudents(id: number) : Observable<Student[]> {
    return this._http.Get<Student[]>(`class/${id}/students`)
      .pipe(
        // delay(400),
        map(students => {
          return students.map((e, i) => ({
            ...e,
            id: i + 1
          }))
        })
      )
  }
}
