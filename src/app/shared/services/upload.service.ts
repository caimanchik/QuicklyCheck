import { Injectable } from '@angular/core';
import { map, Observable, of, zip } from "rxjs";

@Injectable()
export class UploadService {
  private previews: string[] = []
  private images: File[] = []

  constructor() { }

  public addImages(images: FileList): Observable<string[]> {
    if (images && images[0]) {
      const previewsStreams: Observable<string>[] = [];
      for (let i = 0; i < images.length; i++) {
        this.images.push(images[i])

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

  public deleteImage(i: number): string[] {
    this.previews.splice(i, 1)
    return this.previews
  }

  public clearStorage() {
    this.previews = []
  }
}
