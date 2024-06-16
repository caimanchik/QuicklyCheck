import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { forkJoin, map, Observable, switchMap, take } from "rxjs";
import { ITest } from "../interfaces/Tests/Tests/ITest";
import { ITestCreate } from "../interfaces/Tests/Tests/ITestCreate";
import { ITestAllInfo } from "../interfaces/Tests/Tests/ITestAllInfo";
import { ITempTest } from "../interfaces/Tests/Tests/ITempTest";
import { BlankService } from "./blank.service";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private _http: HttpService,
    private _blank: BlankService
  ) { }

  public getTest(pk: number): Observable<ITest> {
    return this._http.Get<ITest>(`test/${pk}`)
      .pipe(take(1))
  }

  public getTestAllInfo(pkTest: number): Observable<ITestAllInfo> {
    return this.getTest(pkTest)
      .pipe(
        switchMap(test => {
          return forkJoin({
            blanks: this._blank.getBlanks(pkTest),
            invalidBlanks: this._blank.getInvalidBlanks(pkTest),
          })
            .pipe(
              map(blanksAll => ({
                ...blanksAll,
                ...test
              }))
            )
        }),
        take(1)
      )
  }

  public createTest(test: ITestCreate) {
    return this._http.Post<ITestCreate, ITest>(`class/${test.grade}/tests/`, test)
      .pipe(take(1))
  }

  public createTempTest(): Observable<ITempTest> {
    return this._http.Post<any, ITest>(
      'temp/tests/',
      {},
      {withCredentials: false})
      .pipe(take(1))
  }

  public deleteTest(testPk: number) {
    return this._http.Delete<void>(`test/${testPk}`)
      .pipe(take(1))
  }
}
