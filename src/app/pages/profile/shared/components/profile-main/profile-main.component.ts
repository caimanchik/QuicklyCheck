import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UserService } from "../../../../../shared/services/user.service";
import { IUserMainInfo } from "../../../../../shared/interfaces/User/IUserMainInfo";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { AuthService } from "../../../../../shared/services/auth.service";
import { ConfirmService } from "../../../../../shared/services/infrastructure/confirm.service";
import { AuthToken } from "../../../../../app.module";
import { appear } from "../../../../../shared/animations/appear";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IProfileForm } from "../../../../../shared/interfaces/Forms/IProfileForm";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";
import { animateIn } from "../../../../../shared/animations/animateIn";
import { animateOut } from "../../../../../shared/animations/animateOut";

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService
  ],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ]),
    trigger('smooth', [
      transition(':enter', useAnimation(animateIn)),
      transition(':leave', useAnimation(animateOut)),
    ])
  ]
})
export class ProfileMainComponent implements OnInit {
  protected userMainInfo!: IUserMainInfo
  protected profileForm!: FormGroup<IProfileForm>
  protected showSave = false

  constructor(
    @Inject(AuthToken) private _authService: AuthService,
    private _confirmService: ConfirmService,
    private _userService: UserService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this._userService.getProfile()
      .subscribe(userMainInfo => {
        this.userMainInfo = userMainInfo;
        this.profileForm = this.getProfileForm()
        this._cd.markForCheck()
      })
  }

  private getProfileForm(): FormGroup<IProfileForm> {
    const form = new FormGroup<IProfileForm>({
      name: new FormControl<string>(this.userMainInfo.profile.first_name, {
        validators: Validators.required,
        nonNullable: true,
      }),
      surname: new FormControl<string>(this.userMainInfo.profile.last_name, {
        validators: Validators.required,
        nonNullable: true,
      }),
      patronymic: new FormControl<string>(this.userMainInfo.profile.patronymic, {
        validators: Validators.required,
        nonNullable: true,
      })
    })

    form.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        this.showSave = (form.controls.name.value !== this.userMainInfo.profile.first_name
            || form.controls.surname.value !== this.userMainInfo.profile.last_name
            || form.controls.patronymic.value !== this.userMainInfo.profile.patronymic)
          && form.valid;
      })

    return form
  }

  protected changePassword() {
    this._router.navigate(["profile", "password"])
  }

  protected logout() {
    this._confirmService.createConfirm({
      message: "Вы действительно хотите выйти?",
      buttonText: "выйти"
    })
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this._authService.logout()
          .subscribe(() => this._router.navigate(['/']))
      })
  }

  protected saveProfile() {
    this.showSave = false

    this._userService.saveProfile({
      first_name: this.profileForm.controls.name.value,
      last_name: this.profileForm.controls.surname.value,
      patronymic: this.profileForm.controls.patronymic.value,
    })
      .subscribe(profile => {
        this.userMainInfo.profile = profile

        this._cd.markForCheck()
      })
  }
}
