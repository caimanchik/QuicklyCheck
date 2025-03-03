import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ITestAllInfo } from "../../../../../shared/interfaces/Tests/Tests/ITestAllInfo";
import { transition, trigger, useAnimation } from "@angular/animations";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";
import { BlankService } from "../../../../../shared/services/blank.service";
import { PatternService } from "../../../../../shared/services/pattern.service";
import { isFilled } from "../../../../../shared/functions/patterns/isFilled";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { appear } from "../../../../../shared/animations/appear";
import { animateOut } from "../../../../../shared/animations/animateOut";
import { TestService } from "../../../../../shared/services/test.service";
import { IBreadCrumbItem } from "../../../../../shared/interfaces/Application/IBreadCrumbItem";
import { catchError, forkJoin, of, take } from "rxjs";
import { StatsService } from "../../../../../shared/services/stats.service";
import { IQuestionStats } from "../../../../../shared/interfaces/Stats/IQuestionStats";
import { IAssessment } from "../../../../../shared/interfaces/Tests/Assessment/IAssessment";
import { isKeyOf } from "../../../../../shared/type-guards/isKeyOf";
import { IAssessments } from "../../../../../shared/interfaces/Tests/Assessment/IAssessments";
import { AssessmentService } from "../../../../../shared/services/assessment.service";

@Component({
  selector: 'app-test-info',
  templateUrl: './test-info.component.html',
  styleUrls: ['./test-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear)),
    ]),
    trigger('animateOut', [
      transition(':leave', useAnimation(animateOut)),
    ])
  ]
})
export class TestInfoComponent implements OnInit {

  protected readonly Object = Object;

  protected test!: ITestAllInfo
  protected showCheckButton = false;

  protected crumbs!: IBreadCrumbItem[]
  protected stats!: IQuestionStats | null

  protected isAssessmentOpened = false

  constructor(
    private _testService: TestService,
    private _blankService: BlankService,
    private _patternService: PatternService,
    private _statsService: StatsService,
    private _assessmentService: AssessmentService,
    private _confirmService: ConfirmService,
    private _errorService: ErrorService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    const testId = +(this._route.snapshot.paramMap.get('id') ?? 0)
    forkJoin({
      test: this._testService.getById(testId)
        .pipe(this._errorService.passErrorWithMessage("Тест не найден")),
      stats: this._statsService.getTestStats(testId)
        .pipe(
          this._errorService.passErrorWithMessage("Не удалось загрузить статистику", [], false),
          catchError(_ => of(null)))
    })
      .pipe(take(1))
      .subscribe(result => {
        this.test = result.test
        this.stats = result.stats
        this.createCrumbs()
        this._cd.markForCheck()
      })

    this._patternService.getPatterns(testId)
      .pipe(this._errorService.passErrorWithMessage("Тест не найден"))
      .subscribe(patterns => this.showCheckButton = isFilled(patterns))
  }

  protected deleteTest() {
    this._confirmService.createConfirm({
      message: "Вы действительно хотите удалить тест?",
      buttonText: 'удалить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._testService.deleteTest(this.test.pk)
          .subscribe(() => this._router.navigate(['class', this.test.grade.pk]))
      })
  }

  protected fillTest() {
    this._confirmService.createConfirm({
      message: 'При редактировании теста меняются все оценки уже проверенных работ. Вы точно хотите продолжить?',
      buttonText: 'продолжить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._router.navigate(['test', this.test.pk, 'fill'])
      })
  }

  protected navigateBlankButton() {
    if (this.showCheckButton)
      this._router.navigate(['/', 'test', this.test.pk, 'upload'])
    else
      this.fillTest()
  }

  protected deleteBlank($event: MouseEvent, i: number, withPattern = true) {
    $event.preventDefault()
    $event.stopPropagation()

    const blank = withPattern ? this.test.blanks[i] : this.test.withoutPattern[i]
    this._confirmService.createConfirm({
      message: `Вы действительно хотите удалить бланк ученика "${blank.authorInfo.name}"?`,
      buttonText: 'удалить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._blankService.deleteBlank(blank.pk)
          .subscribe(() => {
            if (withPattern)
              this.test.blanks.splice(i, 1)
            else
              this.test.withoutPattern.splice(i, 1)
            this._cd.markForCheck()
          })
      })
  }

  protected deleteInvalidBlank($event: MouseEvent, i: number) {
    $event.preventDefault()
    $event.stopPropagation()

    const blank = this.test.invalidBlanks[i]
    this._confirmService.createConfirm({
      message: `Вы действительно хотите удалить бланк от ${
        (blank.createdAt.getDate() < 10 ? '0' : '') + blank.createdAt.getDate()}.${
        (blank.createdAt.getMonth() + 1 < 10 ? '0' : '') + (blank.createdAt.getMonth() + 1)}.${
        blank.createdAt.getFullYear()}?`,
      buttonText: 'удалить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._blankService.deleteInvalidBlank(blank.pk)
          .subscribe(() => {
            this.test.invalidBlanks.splice(i, 1)
            this._cd.markForCheck()
          })
      })
  }

  protected showBlank($event: MouseEvent, pkBlank: number) {
    $event.preventDefault()
    const extras: NavigationExtras = {
      state: {
        blanks: this.test.blanks.concat(this.test.withoutPattern),
        previousUrl: this._router.url
      }
    }

    this._router.navigate(['blank', pkBlank], extras)
  }

  protected showInvalidBlank($event: MouseEvent, pkBlank: number) {
    $event.preventDefault()
    $event.stopPropagation()

    const extras: NavigationExtras = {
      state: {
        invalidBlanks: this.test.invalidBlanks,
        previousUrl: this._router.url
      }
    }

    this._router.navigate(['invalid-blank', pkBlank], extras)
  }

  protected getValuesForColumn(value: string) {
    return this.test.assessments.map(e => {
      if (isKeyOf(e, value as keyof IAssessment))
        return e[value as keyof IAssessment]

      return value
    })
  }

  protected openAssessment() {
    this.isAssessmentOpened = true
  }

  protected updateAssessments($event: IAssessments) {
    this._assessmentService.saveAssessment($event, this.test.pk)
      .pipe(this._errorService.passErrorWithMessage("Не удалось сохранить оценки", [], false))
      .subscribe(testInfo => {
        this.test = testInfo
        this.isAssessmentOpened = false
        this._cd.markForCheck()
      })
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
      }
    ]
  }
}
