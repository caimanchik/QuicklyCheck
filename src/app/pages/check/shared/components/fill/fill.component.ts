import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { IPatternParsed } from "../../../../../shared/interfaces/Tests/Patterns/IPatternParsed";
import { Router } from "@angular/router";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { isFilled } from "../../../../../shared/functions/patterns/isFilled";
import { PatternService } from "../../../../../shared/services/pattern.service";
import { appear } from "../../../../../shared/animations/appear";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";

@Component({
  selector: 'app-fill',
  templateUrl: './fill.component.html',
  styleUrls: ['./fill.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
})
export class FillComponent implements OnInit {

  protected patterns!: IPatternParsed[]
  private pkTest!: number

  constructor(
    private _pattern: PatternService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _error: ErrorService,
    private _destroy: DestroyService,
  ) {
  }

  public ngOnInit(): void {
    this.pkTest = +(localStorage.getItem('temp') ?? 0)

    this._pattern.getPatterns(this.pkTest, true)
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(patterns => {
        this.patterns = patterns
        this._cd.markForCheck()
      })
  }

  protected clickEvent() {
    if (isFilled(this.patterns)) {
      this._router.navigate(['check', 'upload'])
    }
    else
      this._error.createError('Заполните хотя бы один вариант')
  }

  protected updatePattern(pattern: IPatternParsed) {
    this._pattern.updatePattern(pattern, true)
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(newPattern => {
        this.patterns[newPattern.num - 1] = newPattern
        this._cd.markForCheck()
      })
  }
}
