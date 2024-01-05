import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TestService } from "../../../../../shared/services/test.service";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { mergeMap } from "rxjs";
import { PatternParsed } from "../../../../../shared/interfaces/Tests/Patterns/PatternParsed";
import { Router } from "@angular/router";

@Component({
  selector: 'app-fill',
  templateUrl: './fill.component.html',
  styleUrls: ['./fill.component.scss'],
  providers: [DestroyService],
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
  ],
})
export class FillComponent implements OnInit {

  protected patterns!: PatternParsed[]

  constructor(
    private _testService: TestService,
    private _cd: ChangeDetectorRef,
    private _destroy: DestroyService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this._testService.getTests()
      .pipe(
        mergeMap(tests => this._testService.getPatterns(tests[tests.length - 1].pk)),
        this._destroy.takeUntilDestroy
      )
      .subscribe(patterns => {
        console.log(patterns)
        this.patterns = patterns
        this._cd.markForCheck()
      })
  }

  protected clickEvent() {
    this._router.navigate(['check', 'upload'])
  }
}
