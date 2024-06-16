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
import { IBlankView } from "../../../../interfaces/Views/IBlankView";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IEditForm, IIdEditForm } from "../../../../interfaces/Forms/IEditForm";
import { answerValidator } from "../../../../validators/answerValidator";
import { idValidator } from "../../../../validators/idValidator";
import { DestroyService } from "../../../../services/infrastructure/destroy.service";
import { IBlankParsed } from "../../../../interfaces/Tests/Blanks/IBlankParsed";
import { Observable } from "rxjs";
import { ConfirmService } from "../../../../services/infrastructure/confirm.service";
import { answersValidator } from "../../../../validators/answersValidator";
import { transition, trigger, useAnimation } from "@angular/animations";
import { animateIn } from "../../../../animations/animateIn";
import { animateOut } from "../../../../animations/animateOut";

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

  @Output() public closeEvent = new EventEmitter<IBlankParsed | void>()

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
        ...this.view.blank.answers.map((answer, i) => new FormControl<number | string>(
          answer.actual === -1 ? 'X' : answer.actual,
          {
            nonNullable: true,
            validators: [
              answerValidator(`Ошибка в номере ${i + 1}. Диапазон ответов от 1 до 5. X: ответа на данный вопрос не дано`)
            ]}))
      ], {
        validators: answersValidator()
      }),
      variant: new FormControl<number>(this.view.blank.var, {
        nonNullable: true
      }),
      id: new FormGroup<IIdEditForm>({
        idFirst: new FormControl<number>(Math.floor(+this.view.blank.id_blank / 10), {
          nonNullable: true
        }),
        idSecond: new FormControl<number>(+this.view.blank.id_blank % 10, {
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
        console.log(form.controls.answers.errors?.['error'])

        if (form.controls.answers.invalid)
          this.answerError = form.controls.answers.errors?.['error']

        this._cd.markForCheck()
      })
  }

  protected save() {
    if (this.editForm.invalid)
      return

    const blank: IBlankParsed = {
      ...this.view.blank,
      answers: this.editForm.controls.answers.controls.map((control, i) => {
        return {
          ...this.view.blank.answers[i],
          actual: isNaN(+control.value)
            ? -1
            : +control.value
        }
      }),
      var: this.editForm.controls.variant.value,
      author: (
        this.editForm.controls.id.controls.idFirst.value * 10
        + this.editForm.controls.id.controls.idSecond.value).toString()
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
