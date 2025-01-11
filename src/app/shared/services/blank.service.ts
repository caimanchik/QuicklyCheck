import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { delay, forkJoin, map, Observable, of, switchMap, take } from "rxjs";
import { IBlankParsed } from "../interfaces/Tests/Blanks/IBlankParsed";
import { environment } from "../../../environments/environment";
import { IBlankWithAuthor } from "../interfaces/Tests/Blanks/IBlankWithAuthor";
import { translateBlanksFromRequest } from "../functions/blanks/translateBlanksFromRequest";
import { StudentService } from "./student.service";
import { PatternService } from "./pattern.service";
import { sortStrings } from "../functions/application/sortStrings";
import { IBlankInvalidParsed } from "../interfaces/Tests/Blanks/IBlankInvalidParsed";
import { translateWrongBlanksFromRequest } from "../functions/blanks/translateWrongBlanksFromRequest";
import { BlankUpdate } from "../interfaces/Tests/Blanks/BlankUpdate";
import { IStudentCreate } from "../interfaces/Students/IStudentCreate";
import { IBlankValid } from "../interfaces/Tests/Blanks/IBlankValid";

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

  public getWrongBlanks(pkTest: number): Observable<IBlankInvalidParsed[]> {
    return of([
      {
        pk: 1,
        createdAt: Date.now(),
        image: "",
      },
      {
        pk: 1,
        createdAt: new Date().setDate(new Date().getDate() - 7),
        image: "",
      },
      {
        pk: 1,
        createdAt: new Date().setDate(new Date().getDate() - 14),
        image: "",
      },
      {
        pk: 1,
        createdAt: new Date().setDate(new Date().getDate() - 21),
        image: "",
      }])
      .pipe(
        map(blanks => translateWrongBlanksFromRequest(blanks)),
        take(1),
      )
  }

  public deleteWrongBlank(pkBlank: number): Observable<any> {
    return of({})
      .pipe(
        delay(100),
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

  public parseBlanks(blanksReq: IBlankRequest[], temporary: boolean = false, student?: IStudentCreate) : Observable<IBlankParsed[]> {
    return (blanksReq.length > 0
        ? forkJoin(blanksReq
          .map(blank => {
            return !temporary
              ? student
                ? of({
                  ...blank,
                  image: environment.backendUrl + blank.image,
                  author: student.name
                })
                : this._student.getStudent(blank.author)
                .pipe(
                  map(student => ({
                    ...blank,
                    image: environment.backendUrl + blank.image,
                    author: student.name
                  })))
              : of({...blank, image: environment.backendUrl + blank.image, author: blank.idBlank})}))
        : of([])
    )
      .pipe(
        switchMap((blanks: IBlankWithAuthor[]) => {
          return blanks.length > 0
            ? this._pattern.getPatterns(blanks[0].quiz, temporary)
              .pipe(
                map(patterns => translateBlanksFromRequest(blanks, patterns)
                  .sort((a, b) => sortStrings(a.author, b.author))))
            : of([])
        }),
        take(1)
      )
  }

  public updateBlank(blank: BlankUpdate, temporary = false): Observable<IBlankValid> {
    return this._http.Put<BlankUpdate, IBlankValid>(
      (temporary ? "temp/" : "") + `blank/${blank.pk}/`,
      blank,
      { withCredentials: !temporary }
    )
      .pipe(take(1))
  }
}
