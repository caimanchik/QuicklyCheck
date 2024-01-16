import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap, zip } from "rxjs";
import { HttpService } from "./infrastructure/http.service";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { TestService } from "./test.service";
import { IBlankParsed } from "../interfaces/Tests/Blanks/IBlankParsed";

@Injectable()
export class CheckService {
  private previews: string[] = []
  private blanks: File[] = []

  constructor(
    private _http: HttpService,
    private _test: TestService
  ) { }

  public addBlanks(images: FileList): Observable<string[]> {
    if (images && images[0]) {
      const previewsStreams: Observable<string>[] = [];
      for (let i = 0; i < images.length; i++) {
        this.blanks.push(images[i])

        const reader = new FileReader()
        reader.readAsDataURL(images[i])

        const previewStream = new Observable<string>((subscriber) => {
          reader.onload = (event) => {
            const preview = (event.target?.result as string) ?? ''
            subscriber.next(preview)
          };
        });

        previewsStreams.push(previewStream)
      }

      return zip(previewsStreams)
        .pipe(
          map(previews => {
            this.previews = this.previews.concat(previews)
            return this.previews
          })
        )
    }

    return of([])
  }

  public deleteBlank(i: number): string[] {
    this.previews.splice(i, 1)
    this.blanks.splice(i, 1)
    return this.previews
  }

  public clearBlanks() {
    this.previews = []
    this.blanks = []
  }

  public checkBlanks(pkTest: number, temporary: boolean = false): Observable<any> {
    const data = new FormData()

    this.blanks.forEach(blank => data.append("images", blank, blank.name))

    return this._http.Post<FormData, IBlankRequest[]>(
      temporary ? `temp/test/${pkTest}/blanks/` : `test/${pkTest}/blanks/`,
      data,
      {withCredentials: !temporary}
    )
      .pipe(
        tap(() => this.clearBlanks()),
        switchMap(blanks => this._test.parseBlanks(blanks, temporary))
      )
  }

  public getBlanks(pkTest: number): Observable<IBlankParsed[]> {
    return this._http.Get<IBlankRequest[]>(`temp/test/${pkTest}/blanks`, {withCredentials: false})
      .pipe(switchMap(blanks => this._test.parseBlanks(blanks, true)))
  }
}
