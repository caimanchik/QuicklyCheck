import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BlankService } from "../../../../../shared/services/blank.service";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { IBlankParsed } from "../../../../../shared/interfaces/Tests/Blanks/IBlankParsed";
import { translateBlankToRequest } from "../../../../../shared/functions/blanks/translateBlankToRequest";
import { getParamFromRoute } from "../../../../../shared/functions/application/getParamFromRoute";

@Component({
  selector: 'app-blank-info',
  templateUrl: './blank-info.component.html',
  styleUrls: ['./blank-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankInfoComponent implements OnInit {
  protected blanks!: IBlankParsed[]
  protected showIndex!: number
  protected readyToShow!: boolean;

  private readonly _previousUrl!: any[]

  constructor(
    private _blankService: BlankService,
    private _errorService: ErrorService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) {
    this.blanks = this._router.getCurrentNavigation()?.extras.state?.['blanks']
    this._previousUrl = this._router.getCurrentNavigation()?.extras.state?.['previousUrl']
  }

  public ngOnInit() {
    const blankPk = getParamFromRoute(this._route)

    if (this.blanks)
      this.prepareBlanksForView(blankPk)
    else
      this._blankService.getBlank(blankPk)
        .pipe(this._errorService.passErrorWithMessage("Бланк не найден"))
        .subscribe(blank => {
          this.blanks = [blank]
          this.prepareBlanksForView(blankPk)
        })
  }

  private prepareBlanksForView(blankPk: number) {
    this.showIndex = this.findIndex(blankPk)

    this.readyToShow = true
    this._cd.markForCheck()
  }

  private findIndex(blankPk: number): number {
    let index = 0

    this.blanks.forEach((blank, i) => {
      if (blank.pk === blankPk)
        index = i
    })

    return index
  }

  protected navigatePrevious() {
    this._router.navigate(this._previousUrl
      ? [this._previousUrl]
      : ['/', 'test', this.blanks[0].quiz])
  }

  protected saveBlank(blank: IBlankParsed) {
    this._blankService.updateBlank(translateBlankToRequest(blank))
      .subscribe(blankParsed => {
        const index = this.findIndex(blankParsed.pk)
        this.blanks = [
          ...this.blanks.slice(0, index),
          blankParsed,
          ...this.blanks.slice(index + 1)
        ]

        // this.prepareBlanksForView(blankParsed.pk)

        this._cd.detectChanges()
      })
  }
}
