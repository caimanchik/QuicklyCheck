import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TestService } from "../../../../../shared/services/test.service";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { ITestAllInfo } from "../../../../../shared/interfaces/Tests/Tests/ITestAllInfo";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";

@Component({
  selector: 'app-test-info',
  templateUrl: './test-info.component.html',
  styleUrls: ['./test-info.component.scss'],
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
export class TestInfoComponent implements OnInit {
  protected test!: ITestAllInfo

  constructor(
    private _test: TestService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cd: ChangeDetectorRef,
    private _confirm: ConfirmService
  ) { }

  public ngOnInit(): void {
    this._test.getTestAllInfo(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .pipe(take(1))
      .subscribe(test => {
        this.test = test
        this._cd.markForCheck()
      })
  }

  protected deleteTest() {
    this._confirm.createConfirm({
      message: "Вы действительно хотите удалить тест?",
      buttonText: 'удалить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._test.deleteTest(this.test.pk)
          .pipe(take(1))
          .subscribe(() => this._router.navigate(['classes', this.test.grade]))
      })
  }

  protected fillTest() {
    this._confirm.createConfirm({
      message: 'При редактировании теста меняются все оценки уже проверенных работ. Вы точно хотите продолжить?',
      buttonText: 'продолжить'
    })
      .pipe(take(1))
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
    this._confirm.createConfirm({
      message: `Вы действительно хотите удалить бланк ученика "${blank.author}"?`,
      buttonText: 'удалить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._test.deleteBlank(blank.pk)
          .pipe(take(1))
          .subscribe(() => {
            this.test.blanks.splice(i, 1)
            this._cd.markForCheck()
          })
      })
  }

  protected showBlank(pk: number) {
    this._router.navigate(['blank', pk])
  }
}
