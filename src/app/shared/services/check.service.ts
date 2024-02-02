import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap, zip } from "rxjs";
import { HttpService } from "./infrastructure/http.service";
import { IBlankRequest } from "../interfaces/Tests/Blanks/IBlankRequest";
import { BlankService } from "./blank.service";

@Injectable()
export class CheckService {
  private previews: string[] = []
  private blanks: File[] = []

  constructor(
    private _http: HttpService,
    private _blank: BlankService
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
      (temporary ? "test/" : "") + `test/${pkTest}/blanks/`,
      data,
      {withCredentials: !temporary}
    )
      .pipe(
        tap(() => this.clearBlanks()),
        switchMap(blanks => this._blank.parseBlanks(blanks, temporary))
      )
  }
}
