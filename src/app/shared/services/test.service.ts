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
  
  public getPatterns(pk: number) : Observable<PatternParsed[]> {
    return this._http.Get<PatternResponse[]>(`test/${pk}/patterns`)
      .pipe(
        map(patterns => patterns.map(pattern => {
          let elements = pattern.pattern.split(',');

          let parsed: PatternParsed = {
            ...pattern,
            pattern: elements
              .map(e => parseInt(e === '' ? '0' : e))
              .concat(Array<number>(40 - elements.length).fill(-1))
          }

          return parsed
        }))
      )
  }
}
