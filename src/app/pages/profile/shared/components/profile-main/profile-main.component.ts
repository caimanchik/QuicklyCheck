import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UserService } from "../../../../../shared/services/user.service";
import { IUserMainInfo } from "../../../../../shared/interfaces/User/IUserMainInfo";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { AuthService } from "../../../../../shared/services/auth.service";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";
import { AuthToken } from "../../../../../app.module";
import { appear } from "../../../../../shared/animations/appear";

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class ProfileMainComponent implements OnInit {
  protected userMainInfo!: IUserMainInfo

  constructor(
    @Inject(AuthToken) private _auth: AuthService,
    private _cd: ChangeDetectorRef,
    private _confirm: ConfirmService,
    private _user: UserService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._user.getProfile()
      .subscribe(userMainInfo => {
        this.userMainInfo = userMainInfo;
        this._cd.markForCheck()
      })
  }

  protected changePassword() {
    this._router.navigate(["profile", "password"])
  }

  protected logout() {
    this._confirm.createConfirm({
      message: "Вы действительно хотите выйти?",
      buttonText: "выйти"
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._auth.logout()
          .subscribe(() => this._router.navigate(['/']))
      })
  }
}
