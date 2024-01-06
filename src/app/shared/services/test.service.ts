import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable } from "rxjs";
import { BlankRequest } from "../interfaces/Tests/Blanks/BlankRequest";
import { BlankParsed } from "../interfaces/Tests/Blanks/BlankParsed";
import { Test } from "../interfaces/Tests/Tests/Test";
import { PatternParsed } from "../interfaces/Tests/Patterns/PatternParsed";
import { PatternResponse } from "../interfaces/Tests/Patterns/PatternResponse";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private _http: HttpService
  ) { }

  public getBlank(pk: number): Observable<BlankParsed> {
    return this._http.Get<BlankRequest>(`blank/${pk}`)
      .pipe(
        map(blank => ({
            ...blank,
            answers: blank.answers.split(',').map(e => parseInt(e === '' ? '0' : e))
        }))
      )
  }

  public getTests(): Observable<Test[]> {
   return this._http.Get<Test[]>("tests")
  }
  
  public getPatterns(pkTest: number) : Observable<PatternParsed[]> {
    return this._http.Get<PatternResponse[]>(`test/${pkTest}/patterns`)
      .pipe(
        map(patterns => this.translatePatternsFromResponse(patterns, pkTest))
      )
  }

  public updatePattern(pattern: PatternParsed, pkTest: number): Observable<PatternParsed> {
    if (pattern.pk) {
      const patternResponse = this.translatePatternToResponse(pattern)

      if (patternResponse.pattern.length !== 0)
        return this._http.Put<PatternResponse, PatternResponse>(`pattern/${pattern.pk}`, this.translatePatternToResponse(pattern))
          .pipe(map(resp => this.translatePatternFromResponse(resp)))
      else
        return this._http.Delete<null>(`pattern/${pattern.pk}`)
          .pipe(map(() => this.getEmptyPattern(pkTest, pattern.num)))
    }
    else
      return this._http.Post<PatternResponse, PatternResponse>(`test/${pkTest}/patterns`, this.translatePatternToResponse(pattern))
        .pipe(map(resp => this.translatePatternFromResponse(resp)))
  }

  private translatePatternToResponse(pattern: PatternParsed): PatternResponse {
    return {
      ...pattern,
      pattern: pattern.pattern.filter(e => e >= 0).join(',')
    }
  }

  private translatePatternsFromResponse(patterns: PatternResponse[], pkTest: number): PatternParsed[] {
    const result = Array<PatternParsed>(8)

    for (let i = 0; i < 8; i++)
      result[i] = this.getEmptyPattern(pkTest, i + 1)

    patterns.forEach(pattern => result[pattern.num - 1] = this.translatePatternFromResponse(pattern))

    return result
  }

  private translatePatternFromResponse(pattern: PatternResponse): PatternParsed {
    const elements = pattern.pattern.split(',');

    return {
      ...pattern,
      pattern: elements
        .map(e => parseInt(e === '' ? '0' : e))
        .concat(Array<number>(40 - elements.length).fill(-1))
    }
  }

  private getEmptyPattern(test: number, num: number): PatternParsed {
    return {
      test,
      num,
      pattern: Array<number>(40).fill(-1)
    }
  }
}
