import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IBlankInvalid } from "../../../../../shared/interfaces/Tests/Blanks/IBlankInvalid";
import { BlankService } from "../../../../../shared/services/blank.service";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getParamFromRoute } from "../../../../../shared/functions/application/getParamFromRoute";

@Component({
  selector: 'app-blank-info',
  templateUrl: './blank-info.component.html',
  styleUrls: ['./blank-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankInfoComponent implements OnInit {

  protected blanks!: IBlankInvalid[]
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
    this.blanks = this._router.getCurrentNavigation()?.extras.state?.['invalidBlanks']
    this._previousUrl = this._router.getCurrentNavigation()?.extras.state?.['previousUrl']
  }

  public ngOnInit(): void {
    const blankPk = getParamFromRoute(this._route)

    if (this.blanks)
      this.prepareBlanksForView(blankPk)
    else
      this._blankService.getInvalidBlank(blankPk)
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
      : ['/', 'test', this.blanks[0].quiz.pk])
  }
}
