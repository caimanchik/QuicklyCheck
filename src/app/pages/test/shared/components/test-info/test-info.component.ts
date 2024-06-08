import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TestService } from "../../../../../shared/services/test.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ITestAllInfo } from "../../../../../shared/interfaces/Tests/Tests/ITestAllInfo";
import { transition, trigger, useAnimation } from "@angular/animations";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";
import { BlankService } from "../../../../../shared/services/blank.service";
import { PatternService } from "../../../../../shared/services/pattern.service";
import { isFilled } from "../../../../../shared/functions/patterns/isFilled";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { appear } from "../../../../../shared/animations/appear";
import { IGrad } from "../../../../../shared/interfaces/Tests/Assessment/IGrad";
import { ClassesService } from "../../../../../shared/services/classes.service";
import { IClass } from "../../../../../shared/interfaces/Classes/IClass";

@Component({
  selector: 'app-test-info',
  templateUrl: './test-info.component.html',
  styleUrls: ['./test-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(appear)),
    ])
  ]
})
export class TestInfoComponent implements OnInit {
  protected test!: ITestAllInfo
  protected showCheckButton = false;
  protected classInfo!: IClass

  protected assessment: IGrad[] = [
    {
      from: 80,
      to: 100,
      point: 5
    },
    {
      from: 60,
      to: 80,
      point: 4
    },
    {
      from: 40,
      to: 60,
      point: 3
    },
    {
      from: 0,
      to: 40,
      point: 2
    }
  ]

  constructor(
    private _testService: TestService,
    private _blankService: BlankService,
    private _patternService: PatternService,
    private _confirmService: ConfirmService,
    private _errorService: ErrorService,
    private _classesService: ClassesService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    const testId = +(this._route.snapshot.paramMap.get('id') ?? 0)
    this._testService.getTestAllInfo(testId)
      .pipe(this._errorService.passErrorWithMessage("Тест не найден"))
      .subscribe(test => {
        this.test = test
        this._cd.markForCheck()

        this._classesService.getClassInfo(test.grade)
          .subscribe(classInfo => {
            this.classInfo = classInfo
            this._cd.markForCheck()
          })
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
          .subscribe(() => this._router.navigate(['class', this.test.grade]))
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

  protected checkMore() {
    this._router.navigate(['/', 'test', this.test.pk, 'upload'])
  }

  protected deleteBlank(i: number) {
    const blank = this.test.blanks[i]
    this._confirmService.createConfirm({
      message: `Вы действительно хотите удалить бланк ученика "${blank.author}"?`,
      buttonText: 'удалить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._blankService.deleteBlank(blank.pk)
          .subscribe(() => {
            this.test.blanks.splice(i, 1)
            this._cd.markForCheck()
          })
      })
  }

  protected deleteWrongBlank(i: number) {
    const blank = this.test.wrongBlanks[i]
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

        this._blankService.deleteWrongBlank(blank.pk)
          .subscribe(() => {
            this.test.wrongBlanks.splice(i, 1)
            this._cd.markForCheck()
          })
      })
  }

  protected showBlank(pkBlank: number) {
    this._router.navigate(['blank', pkBlank])
  }

  protected showWrongBlank(pkBlank: number) {
    // todo
  }

  protected navigateClass() {
    this._router.navigate(['/', 'class', this.classInfo.pk])
  }
}
