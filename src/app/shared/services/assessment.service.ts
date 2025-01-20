import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { Assessments } from "../interfaces/Tests/Assessment/Assessments";
import { of, take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(
    private readonly _http: HttpService
  ) { }

  public saveAssessment(assessment: Assessments) {
    return of(undefined)
      .pipe(take(1),)
  }
}
