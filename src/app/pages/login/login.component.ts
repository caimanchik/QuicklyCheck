import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../shared/animations/transform-opacity";
import { opacity } from "../../shared/animations/opacity";
import { FormControl, FormGroup } from "@angular/forms";
import { ILoginForm } from "../../shared/interfaces/Forms/ILoginForm";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { take } from "rxjs";
import { UrlService } from "../../shared/services/infrastructure/url.service";

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  protected isLogin: boolean = true
  protected loginForm!: FormGroup<ILoginForm>

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _url: UrlService
  ) {
  }

  public ngOnInit(): void {
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
        //   Validators.minLength(6),
        // ],
        nonNullable: true
      })
    })
  }

  protected login() {
    this._auth.login({
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    })
      .pipe(take(1))
      .subscribe(successful => {
        if (successful) {
          this._router.navigate(this._url.getPreviousUrl().split('/'));
        }
      })
  }
}
