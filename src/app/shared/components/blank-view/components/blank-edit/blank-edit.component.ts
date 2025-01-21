import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IEditForm, IIdEditForm } from "../../../../interfaces/Forms/IEditForm";
import { answerValidator } from "../../../../validators/answerValidator";
import { idValidator } from "../../../../validators/idValidator";
import { DestroyService } from "../../../../services/infrastructure/destroy.service";
import { Observable } from "rxjs";
import { ConfirmService } from "../../../../services/infrastructure/confirm.service";
import { answersValidator } from "../../../../validators/answersValidator";
import { transition, trigger, useAnimation } from "@angular/animations";
import { animateIn } from "../../../../animations/animateIn";
import { animateOut } from "../../../../animations/animateOut";
import { IBlankView } from "../../../../interfaces/Views/IBlankView";
import { IBlankUpdate } from "../../../../interfaces/Tests/Blanks/IBlankUpdate";

@Component({
  selector: 'app-blank-edit',
  templateUrl: './blank-edit.component.html',
  styleUrls: [
    './blank-edit.component.scss',
    '../../styles/answers.scss'
  ],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(animateIn)),
      transition(':leave', useAnimation(animateOut)),
  ])]
})
export class BlankEditComponent implements OnChanges {
  @Input() public view!: IBlankView

  @Output() public closeEvent = new EventEmitter<IBlankUpdate | void>()

  protected editForm!: FormGroup<IEditForm>
  protected answerError!: string

  constructor(
    private _confirmService: ConfirmService,
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['view']?.currentValue)
      return

    this.editForm = this.getEditForm()
    this.initValidators(this.editForm)
    this._cd.markForCheck()
  }

  private getEditForm(): FormGroup<IEditForm> {
    return new FormGroup<IEditForm>({
      answers: new FormArray<FormControl<number | string>>([
        ...this.view.blankScore!.checkedAnswers.map((answer, i) => new FormControl<number | string>(
          answer.actual === '' ? 'X' : answer.actual,
          {
            nonNullable: true,
            validators: [
              answerValidator(`Ошибка в номере ${i + 1}. Диапазон ответов от 1 до 5. X: ответа на данный вопрос не дано`)
            ]}))
      ], {
        validators: answersValidator()
      }),
      variant: new FormControl<number>(this.view.var!, {
        nonNullable: true
      }),
      id: new FormGroup<IIdEditForm>({
        idFirst: new FormControl<number>(Math.floor(+this.view.idBlank! / 10), {
          nonNullable: true
        }),
        idSecond: new FormControl<number>(+this.view.idBlank! % 10, {
          nonNullable: true
        })
      }, {
        validators: idValidator('Диапазон ID от 1 до 99')
      })
    })
  }

  private initValidators(form: FormGroup<IEditForm>) {
    form.controls.id.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        if (!form.controls.id.errors)
          return

        setTimeout(() => {
          form.controls.id.controls.idSecond.setValue(1, {
            emitEvent: false,
          })

          this._cd.markForCheck()
        })
      })

    form.controls.answers.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        this.answerError = ''

        if (form.controls.answers.invalid)
          this.answerError = form.controls.answers.errors?.['error']

        this._cd.markForCheck()
      })
  }

  protected save() {
    if (this.editForm.invalid)
      return

    const idBlank = this.editForm.controls.id.controls.idFirst.value * 10
      + this.editForm.controls.id.controls.idSecond.value

    const blank: IBlankUpdate = {
      ...(this.view as Required<IBlankView>),
      answers: this.editForm.controls.answers.controls.map(control => {
        return isNaN(+control.value)
          ? ""
          : control.value.toString()
      }),
      var: this.editForm.controls.variant.value,
      idBlank: idBlank < 10 ? `0${idBlank}` : idBlank.toString()
    }

    this.closeEvent.next(blank)
  }

  protected cancel() {
    this.canClose()
      .subscribe(confirmed => {
        if (!confirmed)
          return

        this.closeEvent.next()
      })
  }

  protected canClose(message: string = 'Вы действительно хотите закончить редактирование? Изменения не сохранятся'): Observable<boolean> {
    return this._confirmService.createConfirm({
      message,
      buttonText: 'Закончить'
    })
  }
}
