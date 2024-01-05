import { ChangeDetectorRef, Component } from '@angular/core';
import { UploadService } from "../../../../../shared/services/upload.service";
import { take } from "rxjs";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(transformOpacity), {
          params: {
            oStart: 0,
            oEnd: 1,
            transformStart: "translateY(10px)",
            transformEnd: "translateY(0px)",
          }
        }),
    ])
  ],
})
export class UploadComponent {
  protected previews!: string[]

  constructor(
    protected _uploadService: UploadService,
    private _cd: ChangeDetectorRef,
  ) { }

  protected uploadImages(images: FileList) {
    this._uploadService.addImages(images)
      .pipe(take(1))
      .subscribe(previews => {
        this.previews = previews
        this._cd.markForCheck()
      })
  }

  protected check() {

  }

  protected deleteImage(i: number) {
    this.previews = this._uploadService.deleteImage(i)
    this._cd.markForCheck()
  }
}
