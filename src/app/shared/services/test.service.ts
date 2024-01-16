import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { ITest } from "../interfaces/Tests/Tests/ITest";
import { IPatternParsed } from "../interfaces/Tests/Patterns/IPatternParsed";
import { IPatternResponse } from "../interfaces/Tests/Patterns/IPatternResponse";
import { ITestCreate } from "../interfaces/Tests/Tests/ITestCreate";
import { translatePatternToResponse } from "../functions/patterns/translatePatternToResponse";
import { translatePatternFromResponse } from "../functions/patterns/translatePatternFromResponse";
import { translatePatternsFromResponse } from "../functions/patterns/translatePatternsFromResponse";
import { getEmptyPattern } from "../functions/patterns/getEmptyPattern";
import { ITestAllInfo } from "../interfaces/Tests/Tests/ITestAllInfo";
import { translateBlanksFromRequest } from "../functions/blanks/translateBlanksFromRequest";
import { StudentService } from "./student.service";
import { IBlankWithAuthor } from "../interfaces/Tests/Blanks/IBlankWithAuthor";
import { IBlankParsed } from "../interfaces/Tests/Blanks/IBlankParsed";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private _http: HttpService,
    private _student: StudentService
  ) { }

  public getTest(pk: number): Observable<ITest> {
    return this._http.Get<ITest>(`test/${pk}`)
  }

  public getTestAllInfo(pk: number): Observable<ITestAllInfo> {
    return this.getTest(pk)
      .pipe(
        switchMap(test => {
          return this.getBlanks(pk)
            .pipe(
              map(blanks => ({...test, blanks}))
            )
        })
      )
  }

  public getBlanks(pkTest: number): Observable<IBlankParsed[]> {
    return this._http.Get<IBlankRequest[]>(`test/${pkTest}/blanks`)
      .pipe(switchMap(blanks => this.parseBlanks(blanks)))
  }

  public getBlank(pk: number): Observable<IBlankParsed> {
    return this._http.Get<IBlankRequest>(`blank/${pk}`)
      .pipe(
        map(e => [e]),
        switchMap(blanks => this.parseBlanks(blanks)),
        map(blanks => blanks[0])
      )
  }

  public parseBlanks(blanksReq: IBlankRequest[], temporary: boolean = false) : Observable<IBlankParsed[]> {
    return (blanksReq.length > 0
            ? forkJoin(blanksReq
                .map(blank => {
                  return !temporary ? this._student.getStudent(blank.author)
                    .pipe(
                      map(student => ({
                        ...blank,
                        image: environment.backendUrl + blank.image,
                        author: student.name
                      }))
                    ) : of({...blank, image: environment.backendUrl + blank.image, author: blank.id_blank})}))
            : of([])
        )
      .pipe(
        switchMap((blanks: IBlankWithAuthor[]) => {
          return blanks.length > 0
            ? this.getPatterns(blanks[0].test, temporary)
              .pipe(
                map(patterns => translateBlanksFromRequest(blanks, patterns)
                  .sort((a, b) => {
                    if (a.author.toLowerCase() < b.author.toLowerCase())
                      return -1;
                    if (a.author.toLowerCase() > b.author.toLowerCase())
                      return 1;

                    return 0;
                  })))
            : of([])
        }))
  }
  
  public getPatterns(pkTest: number, temporary: boolean = false) : Observable<IPatternParsed[]> {
    return this._http.Get<IPatternResponse[]>(temporary ? `temp/test/${pkTest}/patterns` : `test/${pkTest}/patterns`, {withCredentials: !temporary})
      .pipe(
        map(patterns => translatePatternsFromResponse(patterns, pkTest))
      )
  }

  public updatePattern(pattern: IPatternParsed): Observable<IPatternParsed> {
    if (pattern.pk) {
      const patternResponse = translatePatternToResponse(pattern)

      if (patternResponse.pattern.length !== 0)
        return this._http.Put<IPatternResponse, IPatternResponse>(`pattern/${pattern.pk}`, translatePatternToResponse(pattern))
          .pipe(map(resp => translatePatternFromResponse(resp)))
      else
        return this._http.Delete<null>(`pattern/${pattern.pk}`)
          .pipe(map(() => getEmptyPattern(pattern.test, pattern.num)))
    }

    return this._http.Post<IPatternResponse, IPatternResponse>(`test/${pattern.test}/patterns/`, translatePatternToResponse(pattern))
      .pipe(map(resp => translatePatternFromResponse(resp)))
  }

  public getClassTests(classId: number) {
    return this._http.Get<ITest[]>(`class/${classId}/tests`)
  }

  public createTest(test: ITestCreate) {
    return this._http.Post<ITestCreate, ITest>(`class/${test.grade}/tests/`, test)
  }

  public deleteTest(testPk: number) {
    return this._http.Delete<void>(`test/${testPk}`)
  }

  public deleteBlank(blankPk: number) {
    return this._http.Delete<void>(`blank/${blankPk}`)
  }
}
