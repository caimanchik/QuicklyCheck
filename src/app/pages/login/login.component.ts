import { Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { opacity } from "../../shared/animations/opacity";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    ]),
    trigger('appearOnly', [
      transition(':enter',
        useAnimation(opacity), {
          params: {
            oStart: 0,
            oEnd: 1,
          }
        }),
    ])
  ]
})
export class LoginComponent implements OnInit {

  protected login: boolean = true

  constructor() {
  }

  public ngOnInit(): void {
  }
}
