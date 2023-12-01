import { Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { opacity } from "../../shared/animations/opacity";
import {transformOpacity} from "../../shared/animations/transform-opacity";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
        useAnimation(transformOpacity), {
          params: {
            oStart: 0,
            oEnd: 1,
            transformStart: "translateY(10px)",
            transformEnd: "translateY(0px)",
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
