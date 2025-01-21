import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable, take } from "rxjs";
import { ITest } from "../interfaces/Tests/Tests/ITest";
import { ITestCreate } from "../interfaces/Tests/Tests/ITestCreate";
import { ITestAllInfo } from "../interfaces/Tests/Tests/ITestAllInfo";
import { ITempTest } from "../interfaces/Tests/Tests/ITempTest";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private _http: HttpService,
  ) { }

  public getById(id: number): Observable<ITestAllInfo> {
    return this._http.Get<ITestAllInfo>(`test/${id}`)
      .pipe(
        map(test => ({
          ...test,
          blanks: test.blanks.map(blank => ({
            ...blank,
            image: environment.backendUrl + blank.image
          })),
          withoutPattern: test.withoutPattern.map(blank => ({
            ...blank,
            image: environment.backendUrl + blank.image
          })),
          invalidBlanks: test.invalidBlanks.map(blank => ({
            ...blank,
            // @ts-ignore
            createdAt: new Date(Date.parse(blank.createdAt)),
            image: environment.backendUrl + blank.image
          }))
        })),
        take(1)
      )
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
