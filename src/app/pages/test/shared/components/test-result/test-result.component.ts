import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { ActivatedRoute, Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../../../../shared/animations/appear";
import { getParamFromRoute } from "../../../../../shared/functions/application/getParamFromRoute";
import { IBlanksCheck } from "../../../../../shared/interfaces/Tests/Blanks/IBlanksCheck";
import { BlankService } from "../../../../../shared/services/blank.service";
import { IBlankUpdate } from "../../../../../shared/interfaces/Tests/Blanks/IBlankUpdate";

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class TestResultComponent implements OnInit {
  protected blanks!: IBlanksCheck

  private pkTest!: number

  constructor(
    private _checkService: CheckService,
    private _blankService: BlankService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnInit() {
    this.pkTest = getParamFromRoute(this._route)

    if (!this._checkService.canCheck()) {
      this._router.navigate(['/', 'test', this.pkTest])
      return
    }

    this._checkService.checkBlanks(this.pkTest)
      .subscribe(blanks => {
        this.blanks = blanks
        this._checkService.clearBlanks()
        this._cd.detectChanges()
      })
  }

  protected navigateTest() {
    this._router.navigate(['/', 'test', this.pkTest])
  }

  protected saveBlank(blank: IBlankUpdate) {
    this._blankService.updateBlank(blank)
      .subscribe(blankParsed => {
        const index = this.findIndex(blankParsed.pk)
        this.blanks.blanks = [
          ...this.blanks.blanks.slice(0, index),
          blankParsed,
          ...this.blanks.blanks.slice(index + 1)
        ]

        this._cd.detectChanges()
      })
  }

  private findIndex(blankPk: number): number {
    let index = 0

    this.blanks.blanks.forEach((blank, i) => {
      if (blank.pk === blankPk)
        index = i
    })

    return index
  }
}
