import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { ActivatedRoute, Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { UrlService } from "../../../../../shared/services/infrastructure/url.service";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { TestService } from "../../../../../shared/services/test.service";
import { UrlToken } from "../../../../../app.module";
import { appear } from "../../../../../shared/animations/appear";
import { getParamFromRoute } from "../../../../../shared/functions/application/getParamFromRoute";

@Component({
  selector: 'app-test-upload',
  templateUrl: './test-upload.component.html',
  styleUrls: ['./test-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class TestUploadComponent implements OnDestroy, OnInit {
  protected previews!: string[]

  private needsClear = true
  private testId!: number

  constructor(
    @Inject(UrlToken) private _url: UrlService,
    private _checkService: CheckService,
    private _test: TestService,
    private _error: ErrorService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.testId = getParamFromRoute(this._route)
    this._test.getTest(this.testId)
      .pipe(this._error.passErrorWithMessage("Не удалось открыть страницу загрузки"))
      .subscribe()
  }

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
    this._router.navigate(['test', +(this._route.snapshot.paramMap.get('id') ?? 0), 'result'])
  }

  protected deleteImage(i: number) {
    this.previews = this._checkService.deleteBlank(i)
    this._cd.markForCheck()
  }

  protected goToFill() {
    this.needsClear = true
    this._router.navigate(['/', 'test', this.testId, 'fill'])
  }
}
