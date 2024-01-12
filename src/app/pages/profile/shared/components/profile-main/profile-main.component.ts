import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from "../../../../../shared/services/user.service";
import { take } from "rxjs";
import { UserMainInfo } from "../../../../../shared/interfaces/User/UserMainInfo";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
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
  ]
})
export class ProfileMainComponent implements OnInit {
  protected userMainInfo!: UserMainInfo

  constructor(
    private _cd: ChangeDetectorRef,
    private _user: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._user.getUserEmail()
      .pipe(take(1))
      .subscribe(userMainInfo => {
        this.userMainInfo = userMainInfo;
        this._cd.markForCheck()
      })
  }

  protected changePassword() {
    this._router.navigate(["profile", "password"])
  }
}
