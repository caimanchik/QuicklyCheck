import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ICreateClassForm } from "../../../shared/interfaces/Forms/ICreateClassForm";
import { IClass } from "../../../shared/interfaces/Classes/IClass";
import { DestroyService } from "../../../shared/services/infrastructure/destroy.service";
import { ClassesService } from "../../../shared/services/classes.service";
import { ErrorService } from "../../../shared/services/infrastructure/error.service";
import { ActivatedRoute, Router } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../../shared/animations/appear";

@Component({
  selector: 'app-rename-class',
  templateUrl: './rename-class.component.html',
  styleUrls: ['./rename-class.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ],
})
export class RenameClassComponent implements OnInit {
  protected createForm!: FormGroup<ICreateClassForm>
  protected numberCorrect = true
  protected letterCorrect = true
  protected classInfo!: IClass

  private classId!: number

  constructor(
    private _destroy: DestroyService,
    private _classes: ClassesService,
    private _error: ErrorService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.classId = +(this._route.snapshot.paramMap.get('id') ?? 0)
    this._classes.getClassInfo(this.classId)
      .pipe(this._error.passErrorWithMessage("", ["classes", this.classId]))
      .subscribe((clasInfo) => {
        this.createForm = new FormGroup<ICreateClassForm>({
          number: new FormControl<string>('', {
            nonNullable: true
          }),
          letter: new FormControl<string>('', {
            nonNullable: true
          })
        })

        this.classInfo = clasInfo
        this._cd.markForCheck()

        this.createForm.controls.number.valueChanges
          .pipe(this._destroy.takeUntilDestroy)
          .subscribe(() => this.isNumberCorrect())

        this.createForm.controls.letter.valueChanges
          .pipe(this._destroy.takeUntilDestroy)
          .subscribe(() => this.isLetterCorrect())
      })
  }

  private isFormCorrect() {
    return this.isNumberCorrect() && this.isLetterCorrect()
  }

  private isNumberCorrect() {
    const n = parseInt(this.createForm.controls.number.value)

    if (!n)
      this.numberCorrect = false
    else
      this.numberCorrect = n > 0 && n < 12 && /^\d+$/.test(this.createForm.controls.number.value);

    this._cd.markForCheck()

    return this.numberCorrect
  }

  private isLetterCorrect() {
    const char = this.createForm.controls.letter.value

    this.letterCorrect = char.length === 1 && /^[а-яё]*$/i.test(char)
    this._cd.markForCheck()

    return this.letterCorrect
  }

  protected rename() {
    if (!this.isFormCorrect())
      return

    this._classes.renameClass({
      ...this.classInfo,
      number: this.createForm.controls.number.value,
      letter: this.createForm.controls.letter.value
    })
      .pipe(this._error.passErrorWithMessage("не удалось переименовать класс", ["classes", this.classId]))
      .subscribe(editedClass => {
        this._router.navigate(['class', editedClass.pk])
      })
  }
}
