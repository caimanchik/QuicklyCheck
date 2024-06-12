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

  constructor(
    private _blank: BlankService,
    private _route: ActivatedRoute,
    private _error: ErrorService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) {
    this.blanks = this._router.getCurrentNavigation()?.extras.state?.['blanks']
  }

  public ngOnInit() {
    const blankId = +(this._route.snapshot.paramMap.get('id') ?? 0)

    if (this.blanks)
      this.prepareBlanksForView(blankId)
    else
      this._blank.getBlank(blankId)
        .pipe(this._error.passErrorWithMessage("Бланк не найден"))
        .subscribe(blank => {
          this.blanks = [blank]
          this.prepareBlanksForView(blankId)
        })
  }

  private prepareBlanksForView(blankId: number) {
    this.blanks.forEach((blank, i) => {
      if (blank.pk === blankId) {
        this.showIndex = i
        return
      }
    })

    this.readyToShow = true
    this._cd.markForCheck()
  }

  protected navigateTest() {
    this._router.navigate(['/', 'test', this.blanks[0].test])
  }
}
