import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";

@Component({
  selector: 'app-test-upload',
  templateUrl: './test-upload.component.html',
  styleUrls: ['./test-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ]
})
export class TestUploadComponent implements OnDestroy {
  protected previews!: string[]
  private needsClear = true

  constructor(
    protected _checkService: CheckService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnDestroy(): void {
    if (this.needsClear)
      this._checkService.clearBlanks()
  }

  protected uploadImages(images: FileList) {
    this._checkService.addBlanks(images)
      .pipe(take(1))
      .subscribe(previews => {
        this.previews = previews
        this._cd.markForCheck()
      })
  }

  protected check() {
    this.needsClear = false
    this._router.navigate(['test', +(this._route.snapshot.paramMap.get('id') ?? 0), 'result'])
  }

  protected deleteImage(i: number) {
    this.previews = this._checkService.deleteBlank(i)
    this._cd.markForCheck()
  }

  protected goToFill() {
    this.needsClear = false
    this._router.navigate(['test', +(this._route.snapshot.paramMap.get('id') ?? 0), 'fill'])
  }

}
