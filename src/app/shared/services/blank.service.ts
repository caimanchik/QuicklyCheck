import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable, take } from "rxjs";
import { environment } from "../../../environments/environment";
import { IBlankUpdate } from "../interfaces/Tests/Blanks/IBlankUpdate";
import { IBlankValid } from "../interfaces/Tests/Blanks/IBlankValid";
import { IBlanksCheck } from "../interfaces/Tests/Blanks/IBlanksCheck";
import { IBlankInvalid } from "../interfaces/Tests/Blanks/IBlankInvalid";

@Injectable({
  providedIn: 'root'
})
export class BlankService {
  constructor(
    private _http: HttpService,
  ) { }

  public deleteBlank(blankPk: number): Observable<void> {
    return this._http.Delete<void>(`blank/${blankPk}`)
      .pipe(take(1))
  }

  public getBlanks(pkTest: number, temporary = false): Observable<IBlanksCheck> {
    return this._http.Get<IBlanksCheck>(
      (temporary ? "temp/" : "") + `test/${pkTest}/blanks`,
      {withCredentials: !temporary}
    )
      .pipe(
        map(blanks => ({
          ...blanks,
          blanks: blanks.blanks.map(b => ({
            ...b,
            image: environment.backendUrl +  b.image
          })),
          invalidBlanks: !temporary
            ? blanks.invalidBlanks?.map(b => ({
              ...b,
              image: environment.backendUrl +  b.image
            }))
            : [],
          withoutPattern: blanks.withoutPattern.map(b => ({
            ...b,
            image: environment.backendUrl +  b.image
          }))
        })),
        take(1)
      )
  }

  public deleteInvalidBlank(pkBlank: number): Observable<any> {
    return this._http.Delete<void>(`invalidblank/${pkBlank}`)
      .pipe(take(1))
  }

  public getBlank(pk: number): Observable<IBlankValid> {
    return this._http.Get<IBlankValid>(`blank/${pk}`)
      .pipe(
        map(b => ({
          ...b,
          image: environment.backendUrl + b.image
        })),
        take(1)
      )
  }

  public updateBlank(blank: IBlankUpdate, temporary = false): Observable<IBlankValid> {
    return this._http.Put<IBlankUpdate, IBlankValid>(
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

  public getInvalidBlank(pk: number): Observable<IBlankInvalid> {
    return this._http.Get<IBlankInvalid>(`invalidblank/${pk}`)
      .pipe(
        map(blank => ({
          ...blank,
          image: environment.backendUrl + blank.image
        })),
        take(1))
  }
}
