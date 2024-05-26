import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { Router } from "@angular/router";
import { appear } from "../../../../../shared/animations/appear";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
})
export class UploadComponent implements OnDestroy{
  protected previews!: string[]
  private needsClear = true

  constructor(
    protected _checkService: CheckService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnDestroy(): void {
    if (this.needsClear)
      this._checkService.clearBlanks()
  }

  protected uploadImages(images: FileList) {
    this._checkService.addBlanks(images)
      .subscribe(previews => {
        this.previews = previews
        this._cd.markForCheck()
      })
  }

  protected check() {
    this.needsClear = false
    this._router.navigate(['check', 'result'])
  }

  protected deleteImage(i: number) {
    this.previews = this._checkService.deleteBlank(i)
    this._cd.markForCheck()
  }

  protected goToFill() {
    this.needsClear = false
    this._router.navigate(['check', 'fill'])
  }
}
