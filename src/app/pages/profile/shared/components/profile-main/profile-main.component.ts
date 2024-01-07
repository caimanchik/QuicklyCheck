import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from "../../../../../shared/services/user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IEmailForm } from "../../../../../shared/interfaces/Forms/IEmailForm";
import { take } from "rxjs";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class ProfileMainComponent implements OnInit {
  protected mailSave = false
  protected passSave = false

  protected emailForm!: FormGroup<IEmailForm>

  constructor(
    private _cd: ChangeDetectorRef,
    private _user: UserService,
    private _destroy: DestroyService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      // this.mailSave = true
      // this.passSave = true
      this._cd.markForCheck()
    }, 1000)

    this._user.getUserEmail()
      .pipe(take(1))
      .subscribe(mainInfo => {
        this.emailForm = new FormGroup<IEmailForm>({
          email: new FormControl<string>(mainInfo.email, {
            validators: [Validators.email, Validators.required],
            nonNullable: true
          })
        })

        this.emailForm.controls.email.valueChanges
          .pipe(this._destroy.takeUntilDestroy)
          .subscribe(() => {
            this.mailSave = true;
          })
      })
  }

}
