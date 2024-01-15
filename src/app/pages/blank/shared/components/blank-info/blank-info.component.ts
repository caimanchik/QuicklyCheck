import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TestService } from "../../../../../shared/services/test.service";
import { take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { IBlankView } from "../../../../../shared/interfaces/Views/IBlankView";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { UrlService } from "../../../../../shared/services/infrastructure/url.service";

@Component({
  selector: 'app-blank-info',
  templateUrl: './blank-info.component.html',
  styleUrls: ['./blank-info.component.scss'],
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
export class BlankInfoComponent implements OnInit {
  protected view!: IBlankView

  constructor(
    private _test: TestService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _url: UrlService,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this._test.getBlank(+(this._route.snapshot.paramMap.get('id') ?? 0))
      .pipe(take(1))
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
