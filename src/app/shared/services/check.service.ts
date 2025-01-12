import { Injectable } from '@angular/core';
import { map, Observable, of, take, tap, zip } from "rxjs";
import { HttpService } from "./infrastructure/http.service";
import { BlankService } from "./blank.service";
import { IBlankValid } from "../interfaces/Tests/Blanks/IBlankValid";
import { environment } from "../../../environments/environment";

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
          }),
          take(1)
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

  public canCheck(): boolean {
    return this.blanks.length > 0;
  }

  public checkBlanks(pkTest: number, temporary: boolean = false): Observable<IBlankValid[]> {
    const data = new FormData()

    this.blanks.forEach(blank => data.append("images", blank, blank.name))

    return this._http.Post<FormData, { blanks: IBlankValid[] }>( //todo IBlankCheck
      (temporary ? "temp/" : "") + `test/${pkTest}/blanks/`,
      data,
      {withCredentials: !temporary}
    )
      .pipe(
        tap(() => this.clearBlanks()),
        map(blanks => blanks.blanks),
        map(blanks => blanks.map(b => ({
          ...b,
          image: environment.backendUrl + b.image
        }))),
        take(1)
      )
  }
}
