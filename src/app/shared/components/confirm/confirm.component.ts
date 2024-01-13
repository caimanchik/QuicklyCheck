import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmService } from "../../services/infrastructure/confirm.service";
import { DestroyService } from "../../services/infrastructure/destroy.service";
import { IConfirmAsk } from "../../interfaces/Confirm/IConfirmAsk";
import { transition, trigger, useAnimation } from "@angular/animations";
import { opacity } from "../../animations/opacity";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enter', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        })
    ]),
    trigger('leave', [
      transition(':leave',
        useAnimation(opacity), {
          params: {
            oStart: 1,
            oEnd: 0,
          }
        })
    ])
  ]
})
export class ConfirmComponent implements OnInit {

  protected message: IConfirmAsk | null = null

  constructor(
    private confirmer: ConfirmService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.confirmer.confirmMessages
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(message => {
        this.message = message
        this._cd.markForCheck()
      })
  }

  confirm(result: boolean) {
    this.message = null
    this._cd.markForCheck()
    this.confirmer.confirmResult.next(result)
  }

}
