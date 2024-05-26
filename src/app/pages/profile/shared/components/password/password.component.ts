import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IChangePasswordForm } from "../../../../../shared/interfaces/Forms/IChangePasswordForm";
import { Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { UserService } from "../../../../../shared/services/user.service";
import { IUserChangePassword } from "../../../../../shared/interfaces/User/IUserChangePassword";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";
import { catchError, of, throwError } from "rxjs";
import { appear } from "../../../../../shared/animations/appear";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class PasswordComponent implements OnInit {

  protected changeForm!: FormGroup<IChangePasswordForm>
  protected responseError: string | null = null

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.changeForm = new FormGroup<IChangePasswordForm>({
      oldPassword: new FormControl<string>("", {
        validators: [
          Validators.required,
          Validators.minLength(8)],
        nonNullable: true
      }),
      password: new FormControl<string>("", {
        validators: [
          Validators.required,
          Validators.minLength(8)],
        nonNullable: true
      })
    })

    this.changeForm.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        this.responseError = null
        this._cd.markForCheck()
      })
  }

  protected submit() {
    if (this.changeForm.invalid)
      return

    const changePass: IUserChangePassword = {
      old_password: this.changeForm.controls.oldPassword.value,
      new_password: this.changeForm.controls.password.value
    }

    this._userService.changePassword(changePass)
      .pipe(
        catchError(e => {
          if (e.error.detail[0]) {
            this.responseError = e.error.detail
            this._cd.markForCheck()
            return of(false)
          }

          return throwError(() => e)
        })
      )
      .subscribe(success => {
        if (!success)
          return

        this.return(new Event('click'))
      })
  }

  protected return(event: Event) {
    event.preventDefault()
    this._router.navigate(['profile'])
  }
}
