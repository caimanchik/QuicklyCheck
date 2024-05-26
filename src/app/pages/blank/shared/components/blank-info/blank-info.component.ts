import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { IBlankView } from "../../../../../shared/interfaces/Views/IBlankView";
import { transition, trigger, useAnimation } from "@angular/animations";
import { UrlService } from "../../../../../shared/services/infrastructure/url.service";
import { BlankService } from "../../../../../shared/services/blank.service";
import { ErrorService } from "../../../../../shared/services/infrastructure/error.service";
import { UrlToken } from "../../../../../app.module";
import { appear } from "../../../../../shared/animations/appear";

@Component({
  selector: 'app-blank-info',
  templateUrl: './blank-info.component.html',
  styleUrls: ['./blank-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class BlankInfoComponent implements OnInit {
  protected view!: IBlankView

  constructor(
    @Inject(UrlToken) private _url: UrlService,
    private _blank: BlankService,
    private _route: ActivatedRoute,
    private _error: ErrorService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    const blankId = +(this._route.snapshot.paramMap.get('id') ?? 0)
    this._blank.getBlank(blankId)
      .pipe(this._error.passErrorWithMessage("Бланк не найден"))
      .subscribe(blank => {
        this.view = {
          blank,
          showDetail: false,
          multi: false,
          isLogged: true
        }
        this._cd.markForCheck()
      })
  }

  protected toggleShow() {
    this.view = {
      ...this.view,
      showDetail: !this.view.showDetail
    }

    this._cd.markForCheck()
  }

  protected goPrev() {
    this._router.navigate([this._url.getPreviousUrl()])
  }
}
