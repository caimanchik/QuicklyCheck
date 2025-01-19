import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { IPatternParsed } from "../../../../../shared/interfaces/Tests/Patterns/IPatternParsed";
import { isFilled } from "../../../../../shared/functions/patterns/isFilled";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { PatternService } from "../../../../../shared/services/pattern.service";
import { appear } from "../../../../../shared/animations/appear";
import { TestService } from "../../../../../shared/services/test.service";
import { IBreadCrumbItem } from "../../../../../shared/interfaces/Application/IBreadCrumbItem";
import { ITestAllInfo } from "../../../../../shared/interfaces/Tests/Tests/ITestAllInfo";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";

@Component({
  selector: 'app-test-fill',
  templateUrl: './test-fill.component.html',
  styleUrls: ['./test-fill.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class TestFillComponent implements OnInit {
  protected patterns!: IPatternParsed[]
  protected crumbs!: IBreadCrumbItem[]

  private test!: ITestAllInfo

  constructor(
    private _testService: TestService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _error: ErrorService,
    private _router: Router,
    private _pattern: PatternService,
    private _destroy: DestroyService,
  ) { }

  public ngOnInit(): void {
    const testId = +(this._route.snapshot.paramMap.get('id') ?? 0)

    this._pattern.getPatterns(testId)
      .pipe(this._error.passErrorWithMessage("Ошибка при открытии вариантов", ["test", testId]))
      .subscribe(patterns => {
        this.patterns = patterns
        this._cd.markForCheck()
      })

    this._testService.getById(testId)
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(test => {
        this.test = test
        this.createCrumbs()
        this._cd.markForCheck()
      })
  }

  protected nextClick() {
    if (!isFilled(this.patterns)) {
      this._error.createError('Заполните хотя бы один вариант')
      return
    }

    this._router.navigate(['test', +(this._route.snapshot.paramMap.get('id') ?? 0), 'upload'])
  }

  protected updatePattern(pattern: IPatternParsed) {
    this._pattern.updatePattern(pattern)
      .subscribe(updated => {
        this.patterns[updated.num - 1] = updated
        this._cd.markForCheck()
      })
  }

  protected prevClick() {
    this._router.navigate(['/', 'test', +(this._route.snapshot.paramMap.get('id') ?? 0)])
  }

  private createCrumbs() {
    this.crumbs = [
      {
        text: 'Все классы',
        link: ['/', 'classes']
      },
      {
        text: `${this.test.grade.number}${this.test.grade.letter} класс`,
        link: ['class', this.test.grade.pk.toString()]
      },
      {
        text: this.test.name,
        link: ['/', 'test', this.test.pk.toString()]
      },
      {
        text: 'Варианты',
        link: ['/', 'test', this.test.pk.toString(), 'fill']
      }
    ]
  }
}
