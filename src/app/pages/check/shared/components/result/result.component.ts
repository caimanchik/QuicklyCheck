import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, } from '@angular/core';
import { CheckService } from "../../../../../shared/services/check.service";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";
import { BlankService } from "../../../../../shared/services/blank.service";
import { appear } from "../../../../../shared/animations/appear";
import { IBlanksCheck } from "../../../../../shared/interfaces/Tests/Blanks/IBlanksCheck";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class ResultComponent implements AfterViewInit {

  protected blanks!: IBlanksCheck

  constructor(
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _checkService: CheckService,
    private _blankService: BlankService,
    private _confirm: ConfirmService
  ) { }

  public ngAfterViewInit(): void {
    if (localStorage.getItem('checked')) {
      this._blankService.getBlanks(+(localStorage.getItem('temp') ?? 0), true)
        .subscribe(blanks => {
          this.blanks = blanks
          this._cd.detectChanges()
        })
      return
    }
    else if (this._checkService.canCheck()) {
      this._checkService.checkBlanks(+(localStorage.getItem('temp') ?? 0), true)
        .subscribe(blanks => {
          this.blanks = blanks
          localStorage.setItem('checked', '1')
          this._cd.detectChanges()
        })

      return;
    }
    else
      this._router.navigate(['/', 'check', 'upload'])
  }

  protected checkNew() {
    this._confirm.createConfirm({
      message: 'При проверке нового теста без регистрации результат данной проверки не сохранится. Проверить еще?',
      buttonText: 'проверить'
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        localStorage.removeItem('temp')
        localStorage.removeItem('checked')

        this._router.navigate(['check'])
      })
  }
}
