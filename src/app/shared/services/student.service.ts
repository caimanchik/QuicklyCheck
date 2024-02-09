import { Injectable } from '@angular/core';
import { Observable, take } from "rxjs";
import { IStudent } from "../interfaces/Students/IStudent";
import { HttpService } from "./infrastructure/http.service";
import { IStudentCreate } from "../interfaces/Students/IStudentCreate";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private _http: HttpService
  ) { }

  public getClassStudents(id: number) : Observable<IStudent[]> {
    return this._http.Get<IStudent[]>(`class/${id}/students`)
      .pipe(take(1))
  }

  public createStudent(student: IStudentCreate) {
    return this._http.Post<IStudentCreate, IStudent>(`class/${student.grade}/students/`, student)
      .pipe(take(1))
  }

  public getStudent(pk: number): Observable<IStudent> {
    return this._http.Get<IStudent>(`student/${pk}`)
      .pipe(take(1))
  }
}
