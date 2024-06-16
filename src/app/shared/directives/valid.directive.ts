import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { DestroyService } from "../services/infrastructure/destroy.service";

@Directive({
  selector: '[appValid]',
  providers: [
    DestroyService
  ]
})
export class ValidDirective implements OnInit {
  @Input() public validControl!: FormControl
  @Input() public rightValue: any

  constructor(
    private _destroy: DestroyService
  ) { }

  public ngOnInit() {
    this.invalid = this.validControl.value !== this.rightValue

    this.validControl.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe((value) => {
        this.invalid = value != this.rightValue
      })
  }

  @HostBinding('class.wrong') invalid = false
}
