import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from "@angular/animations";
import { transformOpacity } from "../../../../../shared/animations/transform-opacity";
import { FormControl, FormGroup } from "@angular/forms";
import { CreateClassForm } from "../../../../../shared/interfaces/Forms/CreateClassForm";
import { DestroyService } from "../../../../../shared/services/infrastructure/destroy.service";
import { ClassesService } from "../../../../../shared/services/classes.service";
import { take } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService
  ],
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
  ],
})
export class CreateComponent implements OnInit {
  protected createForm!: FormGroup<CreateClassForm>
  protected numberCorrect = true
  protected letterCorrect = true

  constructor(
    private _destroy: DestroyService,
    private _classes: ClassesService,
    private _cd: ChangeDetectorRef,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this.createForm = new FormGroup<CreateClassForm>({
      number: new FormControl<string>('', {
        nonNullable: true
      }),
      letter: new FormControl<string>('', {
        nonNullable: true
      })
    })

    this.createForm.controls.number.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => this.isNumberCorrect())

    this.createForm.controls.letter.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => this.isLetterCorrect())
  }

  private isFormCorrect() {
    return this.isNumberCorrect() && this.isLetterCorrect()
  }

  private isNumberCorrect() {
    const n = parseInt(this.createForm.controls.number.value)

    if (!n)
      this.numberCorrect = false
    else
      this.numberCorrect = n > 0 && n < 12;

    this._cd.markForCheck()

    return this.numberCorrect
  }

  private isLetterCorrect() {
    const char = this.createForm.controls.letter.value

    this.letterCorrect = char.length === 1 && /^[а-яё]*$/i.test(char)
    this._cd.markForCheck()

    return this.letterCorrect
  }

  protected create() {
    if (!this.isFormCorrect())
      return

    this._classes.createClass({
      number: this.createForm.controls.number.value,
      letter: this.createForm.controls.letter.value
    })
      .pipe(take(1))
      .subscribe(createdClass => {
        this._router.navigate(['classes', createdClass.pk])
      })
  }

}
