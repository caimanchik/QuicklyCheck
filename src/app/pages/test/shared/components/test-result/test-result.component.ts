import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { ActivatedRoute, Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../../../../shared/animations/appear";
import { getParamFromRoute } from "../../../../../shared/functions/application/getParamFromRoute";
import { IBlankValid } from "../../../../../shared/interfaces/Tests/Blanks/IBlankValid";

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
  protected blanks!: IBlankValid[]

  constructor(
    private _checkService: CheckService,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnInit() {
    const pkTest = getParamFromRoute(this._route)

    if (!this._checkService.canCheck()) {
      this._router.navigate(['/', 'test', pkTest])
      return
    }

    this._checkService.checkBlanks(pkTest)
      .subscribe(blanks => {
        this.blanks = blanks
        this._checkService.clearBlanks()
        this._cd.detectChanges()
      })
  }

  protected navigateTest() {
    this._router.navigate(['/', 'test', this.blanks[0].quiz])
  }
}
