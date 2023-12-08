import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacity} from "../../shared/animations/opacity";
import {transformOpacity} from "../../shared/animations/transform-opacity";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ILoginForm} from "../../shared/interfaces/forms/ILoginForm";
import {AuthService} from "../../shared/services/auth.service";
import {take} from "rxjs";
import {Router} from "@angular/router";

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
    private _router: Router
  ) {
  }

  public ngOnInit(): void {
    this.loginForm = new FormGroup<ILoginForm>({
      email: new FormControl<string>("", {
        validators: [
          Validators.required,
          Validators.email,
        ],
        nonNullable: true
      }),
      password: new FormControl<string>("",{
        validators: [
          Validators.minLength(6),
        ],
        nonNullable: true
      })
    })
  }

  protected login() {
    this._auth.login()
      .pipe(take(1))
      .subscribe(successful => {
        if (successful) {
          this._router.navigate(['']);
        }
      })
  }
}
