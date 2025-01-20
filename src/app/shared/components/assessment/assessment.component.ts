import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { IAssessmentControl } from "../../interfaces/Forms/IAssessmentControl";
import { Assessments } from "../../interfaces/Tests/Assessment/Assessments";
import { IAssessment } from "../../interfaces/Tests/Assessment/IAssessment";
import { ConfirmService } from "../../services/infrastructure/confirm.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { opacityIn } from "../../animations/opacityIn";
import { opacityOut } from "../../animations/opacityOut";
import { animateOut } from "../../animations/animateOut";
import { DestroyService } from "../../services/infrastructure/destroy.service";

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  animations: [
    trigger('animation', [
      transition(':enter', useAnimation(opacityIn)),
      transition(':leave', useAnimation(opacityOut))
    ]),
    trigger('animateOut', [
      transition(':leave', useAnimation(animateOut)),
    ])
  ]
})
export class AssessmentComponent implements OnInit, OnChanges {
  @Input() public assessments!: Assessments

  @Input() public isOpened = false
  @Output() public isOpenedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected assessmentsForm!: FormArray<FormGroup<IAssessmentControl>>

  private isConfirmOpened = false;

  constructor(
    private readonly _confirmService: ConfirmService,
    private readonly _destroy: DestroyService,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes?.['isOpened']?.currentValue === undefined)
      return

    const body = document.querySelector('body')
    if (!this.isOpened)
      body?.classList.remove('lock')
    else
      body?.classList.add('lock')

    if (!this.isOpened) {
      this._destroy.ngOnDestroy()
      return;
    }

    this.assessmentsForm = this.getForm();
    this.initFormValidators()
  }

  public ngOnInit(): void {

  }

  protected close(askConfirm = false) {
    if (this.isConfirmOpened)
      return

    if (!askConfirm) {
      this.isOpenedChange.emit(false)
    }

    this.isConfirmOpened = true
    this._confirmService.createConfirm({
      message: "Вы действительно хотите закрыть редактирование оценок? Изменения не сохранятся",
      buttonText: "Закрыть"
    })
      .subscribe(confirmResult => {
        this.isConfirmOpened = false

        if (!confirmResult)
          return

        this.isOpenedChange.emit(false)
      })
  }

  protected deleteControl(i: number) {
    if (this.assessmentsForm.controls.length === 1)
      return

    this.assessmentsForm.controls.splice(i, 1)
  }

  protected insertControl(i: number) {
    const control = this.getControl(null, +this.assessmentsForm.controls[i].controls.to.value)
    this.assessmentsForm.insert(i + 1, control)
  }

  protected stopPropagation($event: MouseEvent) {
    $event.stopPropagation()
  }

  private getForm() {
    return new FormArray(this.assessments.map(a => this.getControl(a)))
  }

  private getControl(assessment: IAssessment | null, previousTo: number | null = null) {
    const control = new FormGroup<IAssessmentControl>({
      to: new FormControl<number>(assessment?.maxPr ?? (previousTo! + 1), {
        nonNullable: true
      }),
      name: new FormControl<string>(assessment?.name ?? "", {
        validators: [Validators.required],
        nonNullable: true
      })
    });

    control.controls.name.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(value => {
        if (!value)
          return

        control.controls.name.setValue(value.slice(0, 4), { emitEvent: false })
      })

    return control;
  }

  private initFormValidators() {
    this.assessmentsForm.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(change => {
        // @ts-ignore
        if ((change as { name: string }).name !== undefined)
          return

        this.assessmentsForm.controls.forEach((control, i) => {
          if (isNaN(+control.controls.to.value) || control.controls.to.value > 100) {
            control.controls.to.setErrors({
              error: 'Неверное значение',
            }, { emitEvent: false })

            return;
          }

          if (i === 0) {
            if (control.controls.to.value <= 0)
              control.controls.to.setErrors({
                error: 'Значение должно быть больше нуля'
              }, { emitEvent: false })
            else
              control.controls.to.setErrors(null, { emitEvent: false })

            return
          }

          if (this.assessmentsForm.controls[i - 1].controls.to.value >= control.controls.to.value) {
            control.controls.to.setErrors({
              error: 'Значение должно быть больше предыдущего'
            }, { emitEvent: false })

            return;
          }

          control.controls.to.setErrors(null, { emitEvent: false })
        })
      })
  }
}
