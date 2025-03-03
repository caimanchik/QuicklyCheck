import { Injectable } from '@angular/core';
import { map, Observable, take } from "rxjs";
import { IPatternParsed } from "../interfaces/Tests/Patterns/IPatternParsed";
import { IPatternResponse } from "../interfaces/Tests/Patterns/IPatternResponse";
import { translatePatternsFromResponse } from "../functions/patterns/translatePatternsFromResponse";
import { translatePatternToResponse } from "../functions/patterns/translatePatternToResponse";
import { translatePatternFromResponse } from "../functions/patterns/translatePatternFromResponse";
import { getEmptyPattern } from "../functions/patterns/getEmptyPattern";
import { HttpService } from "./infrastructure/http.service";

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  constructor(
    private _http: HttpService
  ) { }

  public getPatterns(pkTest: number, temporary: boolean = false) : Observable<IPatternParsed[]> {
    return this._http.Get<IPatternResponse[]>(
      temporary ? `temp/test/${pkTest}/patterns` : `test/${pkTest}/patterns`,
      {withCredentials: !temporary})
      .pipe(
        map(patterns => translatePatternsFromResponse(patterns, pkTest)),
        take(1)
      )
  }

  public updatePattern(pattern: IPatternParsed, temporary: boolean = false): Observable<IPatternParsed> {
    const startUri = (temporary ? "temp/" : "");
    if (pattern.pk) {
      const patternResponse = translatePatternToResponse(pattern)

      if (patternResponse.pattern.length !== 0)
        return this._http.Put<IPatternResponse, IPatternResponse>(
          startUri + `pattern/${pattern.pk}/`,
          translatePatternToResponse(pattern),
          {withCredentials: !temporary}
        )
          .pipe(
            map(resp => translatePatternFromResponse(resp)),
            take(1))
      else
        return this._http.Delete<void>(
          startUri + `pattern/${pattern.pk}`,
          {withCredentials: !temporary}
        )
          .pipe(
            map(() => getEmptyPattern(pattern.quiz, pattern.num)),
            take(1))
    }

    return this._http.Post<IPatternResponse, IPatternResponse>(
      startUri + `test/${pattern.quiz}/patterns/`,
      translatePatternToResponse(pattern),
      {withCredentials: !temporary}
    )
      .pipe(
        map(resp => translatePatternFromResponse(resp)),
        take(1))
  }
}
