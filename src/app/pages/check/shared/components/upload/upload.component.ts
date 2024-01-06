import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { UploadService } from "../../../../../shared/services/upload.service";
import { take } from "rxjs";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { Router } from "@angular/router";

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
export class UploadComponent implements OnDestroy{
  protected previews!: string[]
  private needsClear = true

  constructor(
    protected _uploadService: UploadService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnDestroy(): void {
    if (this.needsClear)
      this._uploadService.clearStorage()
  }

  protected uploadImages(images: FileList) {
    this._uploadService.addImages(images)
      .pipe(take(1))
      .subscribe(previews => {
        this.previews = previews
        this._cd.markForCheck()
      })
  }

  protected check() {
    this.needsClear = false
  }

  protected deleteImage(i: number) {
    this.previews = this._uploadService.deleteImage(i)
    this._cd.markForCheck()
  }

  protected goToFill() {
    this.needsClear = false
    this._router.navigate(['check', 'fill'])
  }
}
