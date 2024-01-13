import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable } from "rxjs";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { IBlankParsed } from "../interfaces/Tests/Blanks/IBlankParsed";
import { ITest } from "../interfaces/Tests/Tests/ITest";
import { IPatternParsed } from "../interfaces/Tests/Patterns/IPatternParsed";
import { IPatternResponse } from "../interfaces/Tests/Patterns/IPatternResponse";
import { ITestCreate } from "../interfaces/Tests/Tests/ITestCreate";

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
        map(patterns => this.translatePatternsFromResponse(patterns, pkTest))
      )
  }

  public updatePattern(pattern: IPatternParsed, pkTest: number): Observable<IPatternParsed> {
    if (pattern.pk) {
      const patternResponse = this.translatePatternToResponse(pattern)

      if (patternResponse.pattern.length !== 0)
        return this._http.Put<IPatternResponse, IPatternResponse>(`pattern/${pattern.pk}`, this.translatePatternToResponse(pattern))
          .pipe(map(resp => this.translatePatternFromResponse(resp)))
      else
        return this._http.Delete<null>(`pattern/${pattern.pk}`)
          .pipe(map(() => this.getEmptyPattern(pkTest, pattern.num)))
    }

    return this._http.Post<IPatternResponse, IPatternResponse>(`test/${pkTest}/patterns`, this.translatePatternToResponse(pattern))
      .pipe(map(resp => this.translatePatternFromResponse(resp)))
  }

  public getClassTests(classId: number) {
    return this._http.Get<ITest[]>(`tests`)
      .pipe(
        map(tests => tests.filter(e => e.grade === classId))
      )
  }

  public createTest(test: ITestCreate) {
    return this._http.Post<ITestCreate, ITest>('tests/', test)
  }

  private translatePatternToResponse(pattern: IPatternParsed): IPatternResponse {
    return {
      ...pattern,
      pattern: pattern.pattern.filter(e => e >= 0).join(',')
    }
  }

  private translatePatternsFromResponse(patterns: IPatternResponse[], pkTest: number): IPatternParsed[] {
    const result = Array<IPatternParsed>(8)

    for (let i = 0; i < 8; i++)
      result[i] = this.getEmptyPattern(pkTest, i + 1)

    patterns.forEach(pattern => result[pattern.num - 1] = this.translatePatternFromResponse(pattern))

    return result
  }

  private translatePatternFromResponse(pattern: IPatternResponse): IPatternParsed {
    const elements = pattern.pattern.split(',');

    return {
      ...pattern,
      pattern: elements
        .map(e => parseInt(e === '' ? '0' : e))
        .concat(Array<number>(40 - elements.length).fill(-1))
    }
  }

  private getEmptyPattern(test: number, num: number): IPatternParsed {
    return {
      test,
      num,
      pattern: Array<number>(40).fill(-1)
    }
  }
}
