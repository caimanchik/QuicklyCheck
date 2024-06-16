import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { forkJoin, map, Observable, of, switchMap, take, zip } from "rxjs";
import { IBlankParsed } from "../interfaces/Tests/Blanks/IBlankParsed";
import { environment } from "../../../environments/environment";
import { IBlankWithAuthor } from "../interfaces/Tests/Blanks/IBlankWithAuthor";
import { translateBlanksFromRequest } from "../functions/blanks/translateBlanksFromRequest";
import { StudentService } from "./student.service";
import { PatternService } from "./pattern.service";
import { sortStrings } from "../functions/application/sortStrings";
import { IBlankInvalidParsed } from "../interfaces/Tests/Blanks/IBlankInvalidParsed";
import { translateInvalidBlanksFromRequest } from "../functions/blanks/translateInvalidBlanksFromRequest";
import { BlankUpdate } from "../interfaces/Tests/Blanks/BlankUpdate";
import { IBlankInvalidRequest } from "../interfaces/Tests/Blanks/IBlankInvalidRequest";

@Injectable({
  providedIn: 'root'
})
export class BlankService {
  constructor(
    private _http: HttpService,
    private _student: StudentService,
    private _pattern: PatternService
  ) { }

  public deleteBlank(pkBlank: number): Observable<void> {
    return this._http.Delete<void>(`blank/${pkBlank}`)
      .pipe(take(1))
  }

  public getBlanks(pkTest: number, temporary = false): Observable<IBlankParsed[]> {
    return this._http.Get<IBlankRequest[]>(
      (temporary ? "temp/" : "") + `test/${pkTest}/blanks`,
      {withCredentials: !temporary}
    )
      .pipe(
        switchMap(blanks => this.parseBlanks(blanks, temporary)),
        take(1)
      )
  }

  public getInvalidBlanks(pkTest: number, temporary = false): Observable<IBlankInvalidParsed[]> {
    return this._http.Get<IBlankInvalidRequest[]>(
      (temporary ? "temp/" : "") + `test/${pkTest}/invalid_blanks`,
      { withCredentials: !temporary }
    )
      .pipe(
        map(blanks => translateInvalidBlanksFromRequest(blanks)),
        take(1)
      )
  }

  public deleteInvalidBlank(pkBlank: number): Observable<void> {
    return this._http.Delete<void>(`invalid_blank/${pkBlank}`)
      .pipe(take(1))
  }

  public deleteInvalidBlanks(blanks: IBlankInvalidParsed[]): Observable<void> {
    return zip(...blanks.map(blank => this.deleteInvalidBlank(blank.pk)))
      .pipe(
        map(() => undefined),
        take(1)
      )
  }

  public getBlank(pk: number): Observable<IBlankParsed> {
    return this._http.Get<IBlankRequest>(`blank/${pk}`)
      .pipe(
        map(e => [e]),
        switchMap(blanks => this.parseBlanks(blanks)),
        map(blanks => blanks[0]),
        take(1)
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
            ? this._pattern.getPatterns(blanks[0].test, temporary)
              .pipe(
                map(patterns => translateBlanksFromRequest(blanks, patterns)
                  .sort((a, b) => sortStrings(a.author, b.author))))
            : of([])
        }),
        take(1)
      )
  }

  public updateBlank(blank: BlankUpdate, temporary = false): Observable<IBlankParsed> {
    return this._http.Put<BlankUpdate, IBlankRequest>(
      (temporary ? "temp/" : "") + `blank/${blank.pk}/`,
      blank,
      { withCredentials: !temporary }
    )
      .pipe(
        switchMap(blankRequest => this.parseBlanks([blankRequest], temporary)),
        map(blanks => blanks[0]),
        take(1)
      )
  }
}
