import { ChangeDetectionStrategy, Component } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { Router } from "@angular/router";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { take } from "rxjs";
import { TestService } from "../../../../../shared/services/test.service";

@Component({
  selector: 'app-check',
  templateUrl: './main-check.component.html',
  styleUrls: ['./main-check.component.scss'],
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
      .pipe(take(1))
      .subscribe((test) => {
        localStorage.setItem("temp", test.pk.toString())
        this._router.navigate(['check', 'fill'])
      })

  }
}
