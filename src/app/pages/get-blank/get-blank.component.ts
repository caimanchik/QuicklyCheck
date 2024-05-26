import {ChangeDetectionStrategy, Component} from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import { appear } from "../../shared/animations/appear";


@Component({
  selector: 'app-get-blank',
  templateUrl: './get-blank.component.html',
  styleUrls: ['./get-blank.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetBlankComponent  {

  constructor() { }
}
