import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { ActivatedRoute, Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { UrlService } from "../../../../../shared/services/infrastructure/url.service";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { UrlToken } from "../../../../../app.module";
import { appear } from "../../../../../shared/animations/appear";
import { getParamFromRoute } from "../../../../../shared/functions/application/getParamFromRoute";
import { TestService } from "../../../../../shared/services/test.service";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";
import { ITestAllInfo } from "../../../../../shared/interfaces/Tests/Tests/ITestAllInfo";
import { IBreadCrumbItem } from "../../../../../shared/interfaces/Application/IBreadCrumbItem";

@Component({
  selector: 'app-test-upload',
  templateUrl: './test-upload.component.html',
  styleUrls: ['./test-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class TestUploadComponent implements OnDestroy, OnInit {
  protected previews!: string[]
  protected crumbs!: IBreadCrumbItem[]

  private needsClear = true
  private testId!: number
  private _test!: ITestAllInfo

  constructor(
    @Inject(UrlToken) private _url: UrlService,
    private _checkService: CheckService,
    private _testService: TestService,
    private _error: ErrorService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute,
    private _destroy: DestroyService,
  ) { }

  public ngOnInit(): void {
    this.testId = getParamFromRoute(this._route)
    this._testService.getById(this.testId)
      .pipe(this._error.passErrorWithMessage("Не удалось открыть страницу загрузки"))
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe()

    this._testService.getById(this.testId)
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(test => {
        this._test = test
        this.createCrumbs()
        this._cd.markForCheck()
      })
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

  private createCrumbs() {
    this.crumbs = [
      {
        text: 'Все классы',
        link: ['/', 'classes']
      },
      {
        text: `${this._test.grade.number}${this._test.grade.letter} класс`,
        link: ['class', this._test.grade.pk.toString()]
      },
      {
        text: this._test.name,
        link: ['/', 'test', this._test.pk.toString()]
      },
      {
        text: 'Проверка',
        link: ['/', 'test', this._test.pk.toString(), 'upload']
      }
    ]
  }
}
