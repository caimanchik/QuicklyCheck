import { ChangeDetectionStrategy, Component } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../shared/animations/transform-opacity";
import { Router } from "@angular/router";

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
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
export class CheckComponent {

  constructor(
    private _router: Router
  ) { }

  protected redirectToVariantFilling() {
    this._router.navigate(['check', 'fill'])
  }
}
