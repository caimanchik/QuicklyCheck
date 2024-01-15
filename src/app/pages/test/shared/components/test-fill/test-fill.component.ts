import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { TestService } from "../../../../../shared/services/test.service";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { IPatternParsed } from "../../../../../shared/interfaces/Tests/Patterns/IPatternParsed";
import { isFilled } from "../../../../../shared/functions/patterns/isFilled";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";

@Component({
  selector: 'app-test-fill',
  templateUrl: './test-fill.component.html',
  styleUrls: ['./test-fill.component.scss'],
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
export class TestFillComponent implements OnInit {
  protected patterns!: IPatternParsed[]

  constructor(
    private _test: TestService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _error: ErrorService,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this._test.getPatterns(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .pipe(take(1))
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
    this._test.updatePattern(pattern)
      .pipe(take(1))
      .subscribe(updated => {
        this.patterns[updated.num - 1] = updated
        this._cd.markForCheck()
      })
  }

  protected prevClick() {
    this._router.navigate(['/', 'test', +(this._route.snapshot.paramMap.get('id') ?? 0)])
  }
}
