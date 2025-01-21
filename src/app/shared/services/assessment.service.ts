import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { take } from "rxjs";
import { IAssessments } from "../interfaces/Tests/Assessment/IAssessments";
import { ITestAllInfo } from "../interfaces/Tests/Tests/ITestAllInfo";

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(
    private readonly _http: HttpService
  ) { }

  public saveAssessment(assessments: IAssessments, testPk: number) {
    return this._http.Post<IAssessments, ITestAllInfo>(`test/${testPk}/assessments/`, assessments)
      .pipe(take(1),)
  }
}
