import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../shared/animations/opacity";

@Component({
  selector: 'app-get-blank',
  templateUrl: './get-blank.component.html',
  styleUrls: ['./get-blank.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        }),
      transition(':leave',
        useAnimation(opacity), {
          params: {
            oStart: 1,
            oEnd: 0,
          }
        })
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetBlankComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
