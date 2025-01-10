import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { forkJoin, map, Observable, switchMap, take } from "rxjs";
import { ITest } from "../interfaces/Tests/Tests/ITest";
import { ITestCreate } from "../interfaces/Tests/Tests/ITestCreate";
import { BlankService } from "./blank.service";
import { ITestAllInfo } from "../interfaces/Tests/Tests/ITestAllInfo";
import { ITempTest } from "../interfaces/Tests/Tests/ITempTest";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private _http: HttpService,
    private _blankService: BlankService,
  ) { }

  public getById(id: number): Observable<ITestAllInfo> {
    return this._http.Get<ITest>(`test/${id}`)
      .pipe(
        switchMap(test => {
          return forkJoin({
            blanks: this._blankService.getBlanks(id),
            wrongBlanks: this._blankService.getWrongBlanks(id),
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
      .pipe(take(1))
  }

  public createTest(test: ITestCreate) {
    return this._http.Post<ITestCreate & {teacher: number}, ITest>(`class/${test.grade}/tests/`, {...test, teacher: 1})
      .pipe(take(1))
  }

  public createTempTest(): Observable<ITempTest> {
    return this._http.Post<{}, ITest>(
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
