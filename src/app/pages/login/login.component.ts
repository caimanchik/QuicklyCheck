import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ILoginForm } from "../../shared/interfaces/Forms/ILoginForm";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { catchError, of, throwError } from "rxjs";
import { UrlService } from "../../shared/services/infrastructure/url.service";
import { IRegistrationForm } from "../../shared/interfaces/Forms/IRegistrationForm";
import { samePasswordValidator } from "../../shared/validators/samePasswordValidator";
import { HttpErrorResponse } from "@angular/common/http";
import { DestroyService } from "../../shared/services/infrastructure/destroy.service";
import { IUserLogin } from "../../shared/interfaces/User/IUserLogin";
import { IUserRegister } from "../../shared/interfaces/User/IUserRegister";
import { AuthToken, UrlToken } from "../../app.module";
import { appear } from "../../shared/animations/appear";
import { leave } from "../../shared/animations/leave";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DestroyService],
  animations: [
    trigger('animation', [
      transition(':enter', useAnimation(appear)),
      transition(':leave', useAnimation(leave))
    ]),
    trigger('appearOnly', [
      transition(':enter', useAnimation(appear)),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  protected isLogin: boolean = true
  protected loginForm!: FormGroup<ILoginForm>
  protected registrationForm!: FormGroup<IRegistrationForm>
  protected loginError: string | null = null
  protected registrationError: string | null = null

  private _canLogin = true
  protected registerToggled = false

  constructor(
    @Inject(AuthToken) private _authService: AuthService,
    @Inject(UrlToken) private _urlService: UrlService,
    private _destroy: DestroyService,
    private _router: Router,
    private _cd: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.initLoginForm()
    this.initRegistrationForm()
  }

  private initLoginForm() {
    this.loginForm = new FormGroup<ILoginForm>({
      email: new FormControl<string>("", {
        // validators: [
        //   Validators.required,
        //   Validators.email,
        // ],
        nonNullable: true
      }),
      password: new FormControl<string>("",{
        // validators: [
        //   Validators.minLength(8),
        // ],
        nonNullable: true
      })
    })

    this.loginForm.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        this.loginError = null
        this._cd.markForCheck()
      })
  }

  private initRegistrationForm() {
    this.registrationForm = new FormGroup<IRegistrationForm>({
      email: new FormControl<string>('', {
        // validators: [Validators.email, Validators.required],
        nonNullable: true
      }),
      password: new FormControl<string>('', {
        validators: [Validators.minLength(8)],
        nonNullable: true
      }),
      repeatPassword: new FormControl<string>('', {
        nonNullable: true
      }),
      personal: new FormControl<boolean>(false, {
        validators: [Validators.requiredTrue],
        nonNullable: true
      })
    }, {
      validators: [samePasswordValidator]
    })

    this.registrationForm.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe((changes) => {
        if (changes.personal !== true)
          return

        this.registrationError = null
        this._cd.markForCheck()
      })

    this.registrationForm.controls.personal.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        this.registerToggled = false
        this._cd.markForCheck()
      })
  }

  protected login() {
    if (this.loginForm.invalid || !this._canLogin)
      return

    this._canLogin = false

    this.loginUser({
      username: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    })
  }

  private loginUser(user: IUserLogin) {
    this._authService.login(user)
      .pipe(
        catchError(e => {
          if (e instanceof HttpErrorResponse && e.status === 401) {
            this.loginError = e.error.detail
            this._cd.markForCheck()
          }
          this._canLogin = true

          return throwError(() => e)
        })
      )
      .subscribe(successful => {
        if (!successful)
          return

        this._router.navigate(this._urlService.getPreviousUrl().split('/'))
      })
  }

  protected changeForm(isLogin: boolean) {
    this.isLogin = isLogin
    this._cd.detectChanges()
  }

  protected register() {
    if (this.registrationForm.invalid || this.registerToggled)
      return

    this.registerToggled = true

    const user: IUserRegister = {
      email: this.registrationForm.controls.email.value,
      password: this.registrationForm.controls.password.value,
    }

    this._authService.register(user)
      .pipe(
        catchError(e => {
          if (e instanceof HttpErrorResponse) {
            if (e.error.detail)
              this.registrationError = e.error.detail
            else {
              this.registrationError = e.error[Object.keys(e.error)[0]][0]
            }
            this._cd.markForCheck()
          }
          this.registerToggled = false

          return of(false)
        })
      )
      .subscribe(registered => {
        if (!registered)
          return

        this._urlService.setCurrentUrl('/')
        this.loginUser({
          username: user.email,
          password: user.password
        })
      })
  }
}
