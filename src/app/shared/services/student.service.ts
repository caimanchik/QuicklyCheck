import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Student } from "../interfaces/Students/Student";
import { HttpService } from "./infrastructure/http.service";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private _http: HttpService
  ) { }

  public getClassStudents(id: number) : Observable<Student[]> {
    return this._http.Get<Student[]>(`class/${id}/students`)
  }
}
