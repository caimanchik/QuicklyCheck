import { Injectable } from '@angular/core';
import { map, Observable, of, zip } from "rxjs";
import { HttpService } from "./infrastructure/http.service";

@Injectable()
export class CheckService {
  private previews: string[] = []
  private blanks: File[] = []

  constructor(
    private _http: HttpService
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
    return this.previews
  }

  public clearBlanks() {
    this.previews = []
  }

  public checkBlanks(): Observable<any> {
    // const bal
    return this._http.Post<File[], any>(`test/${3}/blanks/`, this.blanks)
  }
}
