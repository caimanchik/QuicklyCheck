import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { ITempTest } from "../interfaces/ITempTest";
import { HttpService } from "./infrastructure/http.service";
import { ITest } from "../interfaces/Tests/Tests/ITest";
import { IPatternParsed } from "../interfaces/Tests/Patterns/IPatternParsed";
import { translatePatternsFromResponse } from "../functions/patterns/translatePatternsFromResponse";
import { IPatternResponse } from "../interfaces/Tests/Patterns/IPatternResponse";
import { translatePatternToResponse } from "../functions/patterns/translatePatternToResponse";
import { translatePatternFromResponse } from "../functions/patterns/translatePatternFromResponse";
import { getEmptyPattern } from "../functions/patterns/getEmptyPattern";

@Injectable({
  providedIn: 'root'
})
export class TempTestService {

  constructor(
    private _http: HttpService
  ) { }

  public createTest(): Observable<ITempTest> {
    return this._http.Post<any, ITest>('temp/tests/', {}, {withCredentials: false})

  }

  public getPatterns(pk: number): Observable<IPatternParsed[]> {
    return this._http.Get<IPatternResponse[]>(`temp/test/${pk}/patterns`, {withCredentials: false})
      .pipe(
        map(patterns => translatePatternsFromResponse(patterns, pk))
      )
  }

  public updatePattern(pattern: IPatternParsed, pkTest: number): Observable<IPatternParsed> {
    if (pattern.pk) {
      const patternResponse = translatePatternToResponse(pattern)

      if (patternResponse.pattern.length !== 0)
        return this._http.Put<IPatternResponse, IPatternResponse>(
          `temp/pattern/${pattern.pk}/`,
          translatePatternToResponse(pattern),
          {withCredentials: false}
        )
          .pipe(map(resp => translatePatternFromResponse(resp)))
      else
        return this._http.Delete<null>(`temp/pattern/${pattern.pk}`, {withCredentials: false})
          .pipe(map(() => getEmptyPattern(pkTest, pattern.num)))
    }

    return this._http.Post<IPatternResponse, IPatternResponse>(
      `temp/test/${pkTest}/patterns/`,
      translatePatternToResponse(pattern),
      {withCredentials: false}
    )
      .pipe(map(resp => translatePatternFromResponse(resp)))
  }
}
