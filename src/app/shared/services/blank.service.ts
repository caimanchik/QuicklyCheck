import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { forkJoin, map, Observable, of, switchMap, take } from "rxjs";
import { IBlankParsed } from "../interfaces/Tests/Blanks/IBlankParsed";
import { environment } from "../../../environments/environment";
import { IBlankWithAuthor } from "../interfaces/Tests/Blanks/IBlankWithAuthor";
import { translateBlanksFromRequest } from "../functions/blanks/translateBlanksFromRequest";
import { StudentService } from "./student.service";
import { PatternService } from "./pattern.service";
import { sortStrings } from "../functions/application/sortStrings";

@Injectable({
  providedIn: 'root'
})
export class BlankService {
  constructor(
    private _http: HttpService,
    private _student: StudentService,
    private _pattern: PatternService
  ) { }

  public deleteBlank(blankPk: number) {
    return this._http.Delete<void>(`blank/${blankPk}`)
      .pipe(take(1))
  }

  public getBlanks(pkTest: number, temporary = false): Observable<IBlankParsed[]> {
    return this._http.Get<IBlankRequest[]>(
      (temporary ? "test/" : "") + `test/${pkTest}/blanks`
    )
      .pipe(
        switchMap(blanks => this.parseBlanks(blanks)),
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
        }))
  }
}
