import { ChangeDetectionStrategy, Component } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../shared/animations/appear";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {

  constructor() { }
}
