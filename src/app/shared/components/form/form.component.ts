import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { IBuildForm } from "../../interfaces/Forms/IBuildForm";
import { DestroyService } from "../../services/infrastructure/destroy.service";
import { FormArray, FormGroup } from "@angular/forms";
import { transition, trigger, useAnimation } from "@angular/animations";
import { appear } from "../../animations/appear";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  animations: [
    trigger("appear", [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class FormComponent implements OnInit {
  @Input() public buildForm!: IBuildForm
  @Output() public submitEvent = new EventEmitter<string[]>()
  @Output() public returnEvent = new EventEmitter<void>()

  protected error!: string | null
  protected formGroup!: FormGroup<{controls: FormArray}>

  constructor(
    private _destroy: DestroyService,
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      controls: new FormArray(this.buildForm.controls.map(buildControl => buildControl.control))
    })

    this.formGroup.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => this.updateValidity())
  }

  private updateValidity(submit = false) {
    let found = false

    this.formGroup.controls.controls.controls.forEach(formControl => {
      if (found || formControl.valid && (formControl.touched || submit))
        return

      if (Object.keys(formControl.errors ?? {}).length === 1 && formControl.errors?.['required'])
        this.error = "Поле не может быть пустым"
      else
        this.error = formControl.errors?.['error']

      found = true
    })

    if (!found)
      this.error = null

    this._cd.markForCheck()
  }

  protected submit() {
    if (this.formGroup.invalid) {
      this.updateValidity(true)
      return
    }

    this.submitEvent.emit(this.formGroup.controls.controls.controls.map(control => control.value))
  }
}
