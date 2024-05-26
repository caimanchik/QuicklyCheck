import { ChangeDetectionStrategy, Component } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { Router } from "@angular/router";
import { TestService } from "../../../../../shared/services/test.service";
import { appear } from "../../../../../shared/animations/appear";

@Component({
  selector: 'app-check',
  templateUrl: './main-check.component.html',
  styleUrls: ['./main-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
})
export class MainCheckComponent {
  private _clicked = false

  constructor(
    private _router: Router,
    private _temp: TestService
  ) {
  }

  protected redirectToVariantFilling() {
    if (this._clicked)
      return

    this._clicked = true
    this._temp.createTempTest()
      .subscribe((test) => {
        localStorage.setItem("temp", test.pk.toString())
        this._router.navigate(['check', 'fill'])
      })

  }
}
