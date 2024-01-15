import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable } from "rxjs";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { IBlankParsed } from "../interfaces/Tests/Blanks/IBlankParsed";
import { ITest } from "../interfaces/Tests/Tests/ITest";
import { IPatternParsed } from "../interfaces/Tests/Patterns/IPatternParsed";
import { IPatternResponse } from "../interfaces/Tests/Patterns/IPatternResponse";
import { ITestCreate } from "../interfaces/Tests/Tests/ITestCreate";
import { translatePatternToResponse } from "../functions/tests/translatePatternToResponse";
import { translatePatternFromResponse } from "../functions/tests/translatePatternFromResponse";
import { translatePatternsFromResponse } from "../functions/tests/translatePatternsFromResponse";
import { getEmptyPattern } from "../functions/tests/getEmptyPattern";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private _http: HttpService
  ) { }

  public getBlank(pk: number): Observable<IBlankParsed> {
    return this._http.Get<IBlankRequest>(`blank/${pk}`)
      .pipe(
        map(blank => ({
            ...blank,
            answers: blank.answers.split(',').map(e => parseInt(e === '' ? '0' : e))
        }))
      )
  }

  public getTests(): Observable<ITest[]> {
   return this._http.Get<ITest[]>("tests")
  }
  
  public getPatterns(pkTest: number) : Observable<IPatternParsed[]> {
    return this._http.Get<IPatternResponse[]>(`test/${pkTest}/patterns`)
      .pipe(
        map(patterns => translatePatternsFromResponse(patterns, pkTest))
      )
  }

  public updatePattern(pattern: IPatternParsed, pkTest: number): Observable<IPatternParsed> {
    if (pattern.pk) {
      const patternResponse = translatePatternToResponse(pattern)

      if (patternResponse.pattern.length !== 0)
        return this._http.Put<IPatternResponse, IPatternResponse>(`pattern/${pattern.pk}`, translatePatternToResponse(pattern))
          .pipe(map(resp => translatePatternFromResponse(resp)))
      else
        return this._http.Delete<null>(`pattern/${pattern.pk}`)
          .pipe(map(() => getEmptyPattern(pkTest, pattern.num)))
    }

    return this._http.Post<IPatternResponse, IPatternResponse>(`test/${pkTest}/patterns/`, translatePatternToResponse(pattern))
      .pipe(map(resp => translatePatternFromResponse(resp)))
  }

  public getClassTests(classId: number) {
    return this._http.Get<ITest[]>(`class/${classId}/tests`)
  }

  public createTest(test: ITestCreate) {
    return this._http.Post<ITestCreate, ITest>(`class/${test.grade}/tests/`, test)
  }
}
