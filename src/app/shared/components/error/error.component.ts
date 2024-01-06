import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorService } from "../../services/infrastructure/error.service";
import { DestroyService } from "../../services/infrastructure/destroy.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  providers: [DestroyService],
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit {

  protected error: string = ''
  protected visible: boolean = false

  constructor(
    private _error: ErrorService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this._error.error$
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(error => {
        this.error = error
        this.visible = true
        this._cd.markForCheck()
        setTimeout(() => {
          this.visible = false
          this._cd.markForCheck()
        }, 3000)
      })
  }

}
