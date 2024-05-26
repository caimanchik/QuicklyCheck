import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { IPatternParsed } from "../../../../../shared/interfaces/Tests/Patterns/IPatternParsed";
import { isFilled } from "../../../../../shared/functions/patterns/isFilled";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { PatternService } from "../../../../../shared/services/pattern.service";
import { appear } from "../../../../../shared/animations/appear";

@Component({
  selector: 'app-test-fill',
  templateUrl: './test-fill.component.html',
  styleUrls: ['./test-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class TestFillComponent implements OnInit {
  protected patterns!: IPatternParsed[]

  constructor(
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _error: ErrorService,
    private _router: Router,
    private _pattern: PatternService
  ) { }

  public ngOnInit(): void {
    const testId = +(this._route.snapshot.paramMap.get('id') ?? 0)

    this._pattern.getPatterns(testId)
      .pipe(this._error.passErrorWithMessage("Ошибка при открытии вариантов", ["test", testId]))
      .subscribe(patterns => {
        this.patterns = patterns
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
}
