import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { Class } from "../interfaces/Classes/Class";
import { HttpService } from "./infrastructure/http.service";
import { Student } from "../interfaces/Students/Student";
import { ClassBase } from "../interfaces/Classes/ClassBase";

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
