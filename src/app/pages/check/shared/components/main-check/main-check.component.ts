import { ChangeDetectionStrategy, Component } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { Router } from "@angular/router";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";

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

  constructor(
    private _router: Router,
  ) {
  }

  protected redirectToVariantFilling() {
    this._router.navigate(['check', 'fill'])
  }
}
