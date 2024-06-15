import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { IBlankView } from "../../../../interfaces/Views/IBlankView";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IEditForm, IIdEditForm } from "../../../../interfaces/Forms/IEditForm";
import { answerValidator } from "../../../../validators/answerValidator";
import { idValidator } from "../../../../validators/idValidator";
import { DestroyService } from "../../../../services/infrastructure/destroy.service";

@Component({
  selector: 'app-blank-edit',
  templateUrl: './blank-edit.component.html',
  styleUrls: [
    './blank-edit.component.scss',
    '../../styles/answers.scss'
  ],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankEditComponent implements OnInit, OnChanges {
  @Input() public view!: IBlankView

  protected editForm!: FormGroup<IEditForm>

  constructor(
    private _cd: ChangeDetectorRef,
    private _destroy: DestroyService,
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
            ]
          }))
      ]),
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
  }

  public ngOnInit(): void {
  }

  protected saveEvent() {

  }

  protected cancelEvent() {

  }
}
