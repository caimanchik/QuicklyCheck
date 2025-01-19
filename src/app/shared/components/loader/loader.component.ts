import { ChangeDetectionStrategy, Component } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { opacityIn } from "../../animations/opacityIn";
import { opacityOut } from "../../animations/opacityOut";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(opacityIn)),
      transition(':leave', useAnimation(opacityOut))
    ])
  ]
})
export class LoaderComponent {

  constructor() { }
}
