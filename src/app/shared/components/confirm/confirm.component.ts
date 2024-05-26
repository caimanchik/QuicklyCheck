import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmService } from "../../services/infrastructure/confirm.service";
import { DestroyService } from "../../services/infrastructure/destroy.service";
import { IConfirmAsk } from "../../interfaces/Confirm/IConfirmAsk";
import { transition, trigger, useAnimation } from "@angular/animations";
import { opacityIn } from "../../animations/opacityIn";
import { opacityOut } from "../../animations/opacityOut";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animation', [
      transition(':enter', useAnimation(opacityIn)),
      transition(':leave', useAnimation(opacityOut))
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

  public ngOnInit(): void {
    this.confirmer.confirmMessages
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(message => {
        this.message = message
        this._cd.markForCheck()
      })
  }

  protected confirm(result: boolean) {
    this.message = null
    this._cd.markForCheck()
    this.confirmer.confirmResult.next(result)
  }

  protected stopPropagation($event: MouseEvent) {
    $event.stopPropagation()
  }
}
