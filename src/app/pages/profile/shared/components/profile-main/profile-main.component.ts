import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from "../../../../../shared/services/user.service";
import { IUserMainInfo } from "../../../../../shared/interfaces/User/IUserMainInfo";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { AuthService } from "../../../../../shared/services/auth.service";

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
  protected userMainInfo!: IUserMainInfo

  constructor(
    private _cd: ChangeDetectorRef,
    private _user: UserService,
    private _router: Router,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this._user.getUserEmail()
      .subscribe(userMainInfo => {
        this.userMainInfo = userMainInfo;
        this._cd.markForCheck()
      })
  }

  protected changePassword() {
    this._router.navigate(["profile", "password"])
  }

  protected logout() {
    this._auth.logout()
      .subscribe(() => this._router.navigate(['/']))
  }
}
