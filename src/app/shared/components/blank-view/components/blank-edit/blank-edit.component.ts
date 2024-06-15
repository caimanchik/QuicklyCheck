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

@Component({
  selector: 'app-blank-edit',
  templateUrl: './blank-edit.component.html',
  styleUrls: [
    './blank-edit.component.scss',
    '../../styles/answers.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankEditComponent implements OnInit, OnChanges {
  @Input() public view!: IBlankView

  protected editForm!: FormGroup<IEditForm>

  constructor(
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['view']?.currentValue)
      return

    this.editForm = this.getEditForm()
    this._cd.markForCheck()
  }

  private getEditForm(): FormGroup<IEditForm> {
    return new FormGroup<IEditForm>({
      answers: new FormArray<FormControl<number>>([
        ...this.view.blank.answers.map((answer, i) => new FormControl<number>(answer.actual, {
          nonNullable: true,
          validators: [answerValidator(`Ошибка в номере ${i + 1}. Диапазон ответов от 1 до 5`)]
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

  public ngOnInit(): void {
  }

  protected saveEvent() {

  }

  protected cancelEvent() {

  }
}
