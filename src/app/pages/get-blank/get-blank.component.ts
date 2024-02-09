import {ChangeDetectionStrategy, Component} from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {transformOpacity} from "../../shared/animations/transform-opacity";


@Component({
  selector: 'app-get-blank',
  templateUrl: './get-blank.component.html',
  styleUrls: ['./get-blank.component.scss'],
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetBlankComponent  {

  constructor() { }
}
