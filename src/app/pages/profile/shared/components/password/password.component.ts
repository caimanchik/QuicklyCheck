import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ChangePasswordForm } from "../../../../../shared/interfaces/Forms/ChangePasswordForm";
import { Router } from "@angular/router";
import { samePasswordValidator } from "../../../../../shared/Validators/SamePasswordValidator";
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
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
export class PasswordComponent implements OnInit {

  protected changeForm!: FormGroup<ChangePasswordForm>
  protected passSave = true;

  constructor(
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this.changeForm = new FormGroup<ChangePasswordForm>({
      old: new FormControl<string>("", {
        validators: [
          Validators.required,
          Validators.minLength(8)],
        nonNullable: true
      }),
      new: new FormControl<string>("", {
        validators: [
          Validators.required,
          Validators.minLength(8)],
        nonNullable: true
      }),
      newRepeat: new FormControl<string>("", {
        validators: [
          Validators.required,
          Validators.minLength(8)],
        nonNullable: true
      })
    }, {
      validators: samePasswordValidator
    })
  }

  protected submit() {
    console.log(this.changeForm.errors)
  }

  protected return(event: Event) {
    event.preventDefault()
    this._router.navigate(['profile'])
  }
}
