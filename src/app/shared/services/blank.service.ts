import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { delay, map, Observable, of, take } from "rxjs";
import { environment } from "../../../environments/environment";
import { StudentService } from "./student.service";
import { PatternService } from "./pattern.service";
import { BlankUpdate } from "../interfaces/Tests/Blanks/BlankUpdate";
import { IBlankValid } from "../interfaces/Tests/Blanks/IBlankValid";
import { IBlankInvalid } from "../interfaces/Tests/Blanks/IBlankInvalid";

@Injectable({
  providedIn: 'root'
})
export class BlankService {
  constructor(
    private _http: HttpService,
    private _student: StudentService,
    private _pattern: PatternService
  ) { }

  public deleteBlank(blankPk: number): Observable<void> {
    return this._http.Delete<void>(`blank/${blankPk}`)
      .pipe(take(1))
  }

  public getBlanks(pkTest: number, temporary = false): Observable<IBlankValid[]> {
    return this._http.Get<IBlankValid[]>(
      (temporary ? "temp/" : "") + `test/${pkTest}/blanks`,
      {withCredentials: !temporary}
    )
      .pipe(take(1))
  }

  public deleteInvalidBlank(pkBlank: number): Observable<any> {
    return of({})
      .pipe(
        delay(100),
        take(1)
      )
  }

  public getBlank(pk: number): Observable<IBlankValid> {
    return this._http.Get<IBlankValid>(`blank/${pk}`)
      .pipe(
        map(blank => ({
          ...blank,
          image: environment.backendUrl + blank.image
        })),
        take(1)
      )
  }
  
  public getInvalidBlank(pk: number): Observable<IBlankInvalid> {
    return this._http.Get<IBlankInvalid>(`invalidblank/${pk}`)
      .pipe(
        map(blank => ({
          ...blank,
          image: environment.backendUrl + blank.image
        })),
        take(1)
      )
  }

  public updateBlank(blank: BlankUpdate, temporary = false): Observable<IBlankValid> {
    return this._http.Put<BlankUpdate, IBlankValid>(
      (temporary ? "temp/" : "") + `blank/${blank.pk}/`,
      blank,
      { withCredentials: !temporary }
    )
      .pipe(
        map(blank => ({
          ...blank,
          image: environment.backendUrl + blank.image
        })),
        take(1))
  }
}
